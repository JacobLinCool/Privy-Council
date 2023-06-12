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

		const teamCreate = await prisma.teamMember.create({
			data: {
				role: "admin",
				user: {
					connect: { email: locals?.token?.sub },
				},
				team: {
					create: {
						name: name,
						bio: "",
						namespace: {
							create: {
								name: name,
							},
						},
					},
				},
			},
		});
		//console.log("teamCreate:", teamCreate);

		throw redirect(302, "/@" + name + "/manage");
	},
};
