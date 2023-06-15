import { log } from "$lib/server/log";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const councilor = await prisma.councilor.findUnique({
		where: {
			id: parseInt(params.id),
		},
	});
	if (!councilor) {
		throw redirect(302, `/@${params.namespace}`);
	}

	if (councilor.namespace_name !== params.namespace) {
		throw redirect(302, `/@${councilor.namespace_name}/councilor/${params.id}`);
	}

	if (!is_namespace_editable(locals.user, params.namespace) && councilor.visibility === false) {
		throw redirect(302, `/@${params.namespace}`);
	}

	return { councilor };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const councilor = await prisma.councilor.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!councilor) {
			return;
		}

		if (!is_namespace_editable(locals.user, councilor.namespace_name)) {
			return;
		}

		await prisma.councilor.delete({
			where: {
				id: parseInt(params.id),
			},
		});

		// create log
		log(`Delete Councilor "${councilor.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${councilor.namespace_name}/manage`);
	},
	save: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const data = await request.formData();
		const name = data.get("name")?.toString();
		const base_model = data.get("base_model")?.toString();
		const trait = data.get("trait")?.toString();
		if (!name || !base_model || !trait) {
			return;
		}

		const councilor = await prisma.councilor.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!councilor) {
			return;
		}

		if (!is_namespace_editable(locals.user, councilor.namespace_name)) {
			return;
		}

		// update the councilor
		await prisma.councilor.update({
			where: {
				id: parseInt(params.id),
			},
			data: {
				name: name,
				model: base_model,
				trait: trait,
			},
		});

		log(`Update Councilor "${councilor.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${councilor.namespace_name}/councilor/${params.id}`);
	},
	clone: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!councilor) {
			return;
		}

		if (!is_namespace_editable(locals.user, councilor.namespace_name)) {
			return;
		}

		// verify if clone destination is in user's own namespace
		const data = await request.formData();
		const to_namespace = data.get("namespace")?.toString();
		if (!to_namespace) {
			return;
		}

		if (!is_namespace_editable(locals.user, to_namespace)) {
			return;
		}

		const cloned_councilor = await prisma.councilor.create({
			data: {
				name: councilor.name,
				visibility: councilor.visibility,
				model: councilor.model,
				trait: councilor.trait,
				namespace: {
					connect: {
						name: to_namespace,
					},
				},
			},
		});

		log(`Create Councilor "${cloned_councilor.name}"`, locals.user.email, to_namespace);
		throw redirect(302, `/@${to_namespace}/councilor/${cloned_councilor.id}`);
	},
};
