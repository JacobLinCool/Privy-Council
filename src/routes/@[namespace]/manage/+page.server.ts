import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}
	if (!is_namespace_editable(locals.user, params.namespace)) {
		throw redirect(302, `/@${params.namespace}`);
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
