import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { to_number } from "svelte/internal";
import { verifyOwnNamespace, ownNamespace } from "$lib/server/verify";
import { log } from "$lib/server/log";

/*
{
  councilor: {
    id: 5,
    name: '111710',
    visibility: false,
    model: 'ttt',
    trait: 'tttt',
    created: 2023-06-11T16:24:02.656Z,
    updated: 2023-06-11T16:24:02.667Z,
    namespace_name: 'howardimportant-rw5nfp'
  },
  ownNamespace: [ 'newteam', 'test2', 'howardimportant-rw5nfp' ]
}
*/
export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}

	// get the namespace of the councilor
	const councilor = await prisma.councilor.findUnique({
		where: {
			id: to_number(params.id),
		},
	});

	if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
		throw redirect(302, "/");
	} else if (!(await verifyOwnNamespace(locals?.token?.sub, councilor?.namespace_name))) {
		throw redirect(302, "/@" + params.namespace + "/manage");
	} else if (councilor?.namespace_name !== params.namespace) {
		throw redirect(302, "/@" + params.namespace + "/manage");
	}

	const ownNS = await ownNamespace(locals?.token?.sub);
	//console.log({councilor:  councilor, ownNamespace: ownNS.ownNamespace });
	return { councilor: councilor, ownNamespace: ownNS.ownNamespace };
};

/** @type {import('./$types').Actions} */
export const actions = {
	delete: async ({ locals, params }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});

		// --- verify started ---
		if (!(await verifyOwnNamespace(locals?.token?.sub, councilor?.namespace_name))) {
			throw redirect(302, "/");
		}

		// delete councilor
		await prisma.councilor.delete({
			where: {
				id: to_number(params.id),
			},
		});

		// create log
		log('Delete Councilor "' + councilor?.name + '"', locals?.token?.sub, params.namespace);
		throw redirect(302, "/@" + councilor?.namespace_name + "/manage");
		return {};
	},
	save: async ({ locals, params, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		const data = await request.formData();
		const name = data.get("name")?.toString();
		const baseModel = data.get("baseModel")?.toString();
		const trait = data.get("trait")?.toString();
		if (name === undefined || baseModel === undefined || trait === undefined) {
			throw redirect(302, "/@" + params.namespace + "/councilor/new");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});

		// --- verify started ---
		if (!(await verifyOwnNamespace(locals?.token?.sub, councilor?.namespace_name))) {
			throw redirect(302, "/");
		}

		// update the councilor
		await prisma.councilor.update({
			where: {
				id: to_number(params.id),
			},
			data: {
				name: name,
				model: baseModel,
				trait: trait,
			},
		});

		log('Update Councilor "' + councilor?.name + '"', locals?.token?.sub, params.namespace);
		throw redirect(302, "/@" + councilor?.namespace_name + "/councilor/" + params.id);
		return {};
	},
	clone: async ({ locals, params, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});
		if (councilor === null) {
			throw redirect(302, "/");
		}

		// --- verify started ---
		if (!(await verifyOwnNamespace(locals?.token?.sub, councilor?.namespace_name))) {
			throw redirect(302, "/");
		}

		// verify if clone destination is in user's own namespace
		const data = await request.formData();
		const toNamespace = data.get("namespace")?.toString();
		const userOwnNS = await ownNamespace(locals?.token?.sub);

		if (toNamespace === undefined || userOwnNS.ownNamespace === undefined) {
			throw redirect(302, "/");
		}
		// find if namespace is in userOwnNS
		let found = false;
		userOwnNS.ownNamespace.forEach((ownNS) => {
			if (ownNS === toNamespace) {
				found = true;
			}
		});
		if (!found) {
			//console.log("not found");
			throw redirect(302, "/@" + councilor?.namespace_name + "/councilor/" + params.id);
		}

		// clone the councilor
		// create the councilor
		const cloneCouncilor = await prisma.councilor.create({
			data: {
				name: councilor.name,
				visibility: councilor.visibility,
				model: councilor.model,
				trait: councilor.trait,
				namespace_name: toNamespace,
			},
		});

		// add the councilor to the namespace
		const nsUpdate = await prisma.namespace.update({
			where: {
				name: params.namespace,
			},
			data: {
				councilors: {
					connect: {
						id: cloneCouncilor.id,
					},
				},
			},
		});

		log('Create Councilor "' + councilor?.name + '"', locals?.token?.sub, params.namespace);
		throw redirect(302, "/@" + toNamespace + "/councilor/" + cloneCouncilor.id);
		return {};
	},
};
