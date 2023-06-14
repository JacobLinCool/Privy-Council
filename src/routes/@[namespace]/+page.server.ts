import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { log } from "$lib/server/log";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}

	const namespace = await prisma.namespace.findUnique({
		where: {
			name: params.namespace,
		},
		include: {
			user: true,
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

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const data = await request.formData();
		const name = data.get("name")?.toString();
		const bio = data.get("bio")?.toString();

		if (!name || !bio) {
			throw redirect(302, `/@${params.namespace}`);
		}

		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, "/");
		}

		const info = await prisma.namespace.findUnique({
			where: {
				name: params.namespace,
			},
			include: {
				user: true,
				team: true,
			},
		});
		if (info?.user) {
			await prisma.user.update({
				where: {
					id: info.user.id,
				},
				data: {
					name: name,
					bio: bio,
				},
			});
		} else {
			await prisma.team.update({
				where: {
					id: info?.team?.id,
				},
				data: {
					name: name,
					bio: bio,
				},
			});
		}

		log(`Update Profile`, locals.user.email, params.namespace);
		throw redirect(302, `/@${params.namespace}`);
	},
};
