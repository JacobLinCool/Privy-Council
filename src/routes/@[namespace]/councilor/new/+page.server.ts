import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { log } from "$lib/server/log";
import debug from "debug";

const console_log = debug("app:councilor:new");

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}
	if (!is_namespace_editable(locals.user, params.namespace)) {
		throw redirect(302, "/");
	}
};

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const data = await request.formData();
		const name = data.get("name")?.toString();
		const base_model = data.get("base_model")?.toString();
		const trait = data.get("trait")?.toString();
		console_log(name, base_model, trait);
		if (!name || !base_model || !trait) {
			throw redirect(302, `/@${params.namespace}/councilor/new`);
		}

		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, "/");
		}

		// create the councilor
		const councilor = await prisma.councilor.create({
			data: {
				name: name,
				visibility: true,
				model: base_model,
				trait: trait,
				namespace: {
					connect: {
						name: params.namespace,
					},
				},
			},
		});

		log(`Create Councilor "${councilor.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${params.namespace}/councilor/${councilor.id}`);
	},
};
