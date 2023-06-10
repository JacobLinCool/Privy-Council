import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

/** @type {import('./$types').Actions} */
export const actions = {
	createteam: async ({ locals, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		const data = await request.formData();
		const name = data.get("name")?.toString();
		if (name === undefined) {
			throw redirect(302, "/createteam");
		}

		// check if the name exists in the database team
		const teamExist = await prisma.namespace.count({
			where: {
				name: name,
			},
		});
		if (teamExist != 0) {
			// throw error
			throw redirect(302, "/createteam");
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
