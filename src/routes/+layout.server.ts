import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.token?.sub
		? await prisma.user.findUnique({
				where: { email: locals.token.sub },
				include: {
					namespace: true,
					memberships: {
						include: {
							team: {
								select: {
									name: true,
								},
							},
						},
					},
				},
		  })
		: null;

	return {
		user,
	};
};
