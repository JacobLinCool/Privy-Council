import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}

	const namespace = await prisma.namespace.findUnique({
		where: {
			name: params.namespace,
		},
		include: {
			team: {
				include: {
					memberships: {
						include: {
							user: {
								select: {
									name: true,
									email: true,
								},
							},
						},
					},
				},
			},
			councilors: true,
			committees: true,
			libraries: true,
			conversations: true,
		},
	});
	if (!namespace) {
		throw redirect(302, "/");
	}

	return { namespace };
};
