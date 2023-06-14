import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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
			user: {
				include: {
					memberships: {
						orderBy: {
							created: "desc",
						},
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
			},
			team: {
				include: {
					memberships: {
						orderBy: {
							created: "desc",
						},
						include: {
							user: {
								select: {
									name: true,
									email: true,
									namespace_name: true,
								},
							},
						},
					},
				},
			},
			councilors: {
				orderBy: {
					created: "desc",
				},
			},
			committees: {
				orderBy: {
					created: "desc",
				},
			},
			libraries: {
				orderBy: {
					created: "desc",
				},
			},
			conversations: {
				orderBy: {
					created: "desc",
				},
			},
		},
	});
	if (!namespace) {
		throw redirect(302, "/");
	}

	return { namespace };
};
