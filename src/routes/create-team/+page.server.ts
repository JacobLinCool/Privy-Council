import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const data = await request.formData();
		const name = data.get("name")?.toString()?.toLowerCase();
		if (!name) {
			throw redirect(302, "/create-team");
		}

		try {
			await prisma.membership.create({
				data: {
					role: "admin",
					user: {
						connect: { email: locals.user.email },
					},
					team: {
						create: {
							name: name,
							bio: `${locals.user.name}'s team`,
							namespace: {
								create: {
									name: name,
								},
							},
						},
					},
				},
			});
		} catch (err) {
			throw error(400, "Team already exists");
		}

		throw redirect(302, `/@${name}/manage`);
	},
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}
};
