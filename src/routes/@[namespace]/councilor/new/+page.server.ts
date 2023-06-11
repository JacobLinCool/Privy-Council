import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { verifyOwnNamespace } from "$lib/server/verify";
import { log } from "$lib/server/log";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}
	if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
		throw redirect(302, "/");
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	createcouncilor: async ({ locals, params, request }) => {
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

		// return all information belongs to user
		if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
			throw redirect(302, "/");
		}

		// create the councilor
		const councilor = await prisma.councilor.create({
			data: {
				name: name,
				visibility: false,
				model: baseModel,
				trait: trait,
				namespace_name: params.namespace,
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
						id: councilor.id,
					},
				},
			},
		});

		log('Create Councilor "' + councilor.name + '"', locals?.token?.sub, params.namespace);
		throw redirect(302, "/@" + params.namespace + "/councilor/" + councilor.id);
		return {};
	},
};
