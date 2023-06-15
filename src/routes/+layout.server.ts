import { prisma } from "$lib/server/prisma";
import type { LayoutServerLoad } from "./$types";

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
									namespace_name: true,
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
