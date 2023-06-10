import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

/** @type {import('./$types').Actions} */
export const actions = {
	createcouncilor: async ({ locals, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		const data = await request.formData();
		const name = data.get("name")?.toString();
		const baseModel = data.get("baseModel")?.toString();
		const trait = data.get("trait")?.toString();
		if (name === undefined || baseModel === undefined || trait === undefined) {
			throw redirect(302, "/councilor/new");
		}

		// create the namespace
		const namespace = await prisma.namespace.create({
			data: {
				name: name,
			},
		});

		// create the team
		const team = await prisma.team.create({
			data: {
				name: name,
				bio: "",
				namespace_name: name,
			},
		});

		// add the user to the team
		const user = await prisma.user.update({
			where: {
				email: locals.token.sub,
			},
			data: {
				teams: {
					connect: {
						id: team.id,
					},
				},
			},
		});

		throw redirect(302, "/@" + name + "/manage");
	},
};
