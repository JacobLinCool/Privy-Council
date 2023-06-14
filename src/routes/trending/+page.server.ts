import { prisma } from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}

	const councilors = await prisma.councilor.findMany({
		orderBy: {
			created: "desc",
		},
		take: 30,
		include: {
			namespace: {
				include: {
					user: {
						select: {
							name: true,
						},
					},
					team: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});

	return { councilors };
};
