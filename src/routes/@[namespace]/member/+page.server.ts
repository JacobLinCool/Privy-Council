import { redirect, error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable, is_namespace_owner } from "$lib/server/verify";
import { log } from "$lib/server/log";
import debug from "debug";

const console_log = debug("app:team");

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
					...(is_namespace_owner(locals.user, params.namespace)
						? {
								logs: {
									include: {
										user: {
											select: {
												name: true,
											},
										},
									},
								},
						  }
						: undefined),
					memberships: {
						select: {
							id: true,
							role: true,
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
		},
	});

	if (!namespace) {
		throw redirect(302, "/");
	}

	if (!namespace.team) {
		throw redirect(302, "/");
	}

	return { team: namespace.team };
};

export const actions: Actions = {
	leave: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}
		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, `/@${params.namespace}`);
		}

		const data = await request.formData();
		const email = data.get("email")?.toString();
		if (!email) {
			throw redirect(302, `/@${params.namespace}/member`);
		}

		const is_admin = is_namespace_owner(locals.user, params.namespace);
		if (!is_admin && email !== locals.user.email) {
			return;
		}

		const result = await prisma.$transaction(async (prisma) => {
			if (is_admin) {
				const admin_count = await prisma.membership.count({
					where: {
						role: "admin",
						team: {
							namespace: {
								name: params.namespace,
							},
						},
					},
				});

				if (admin_count <= 1) {
					console_log("Cannot leave the team, you are the only admin");
					return { count: 0 };
				}
			}

			return prisma.membership.deleteMany({
				where: {
					user: {
						email: email,
					},
					team: {
						namespace: {
							name: params.namespace,
						},
					},
				},
			});
		});

		if (result.count === 0) {
			console_log("No one left the team");
			throw error(400, "No one left the team");
		} else if (result.count > 1) {
			console_log("Something went wrong, more than one user left the team");
			throw error(500, "Something went wrong, more than one user left the team");
		}
		log(`User "${email}" left the team`, locals.user.email, params.namespace);

		if (email === locals.user.email) {
			throw redirect(302, "/");
		}

		throw redirect(302, `/@${params.namespace}/member`);
	},
	"delete-team": async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}
		if (!is_namespace_owner(locals.user, params.namespace)) {
			throw redirect(302, "/@" + params.namespace);
		}

		const result = await prisma.namespace.delete({
			where: {
				name: params.namespace,
			},
		});
		if (result) {
			console_log(`Goodbye ${params.namespace}`);
		}

		throw redirect(302, "/");
	},
	"add-member": async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}
		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, `/@${params.namespace}`);
		}

		const data = await request.formData();
		const email = data.get("email")?.toString();
		if (!email) {
			throw redirect(302, `/@${params.namespace}/member`);
		}

		const is_admin = is_namespace_owner(locals.user, params.namespace);
		if (!is_admin) {
			return;
		}

		const team_info = await prisma.team.findUnique({
			where: {
				namespace_name: params.namespace,
			},
		});

		await prisma.membership.create({
			data: {
				role: "member",
				user: {
					connect: { email: email },
				},
				team: {
					connect: { id: team_info?.id },
				},
			},
		});

		log(`User "${email}" has been added to the team`, locals.user.email, params.namespace);

		throw redirect(302, `/@${params.namespace}/member`);
	},
	"change-role": async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}
		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, `/@${params.namespace}`);
		}

		const data = await request.formData();
		const email = data.get("email")?.toString();
		const role = data.get("role")?.toString();
		if (!email || !role) {
			throw redirect(302, `/@${params.namespace}/member`);
		}

		const is_admin = is_namespace_owner(locals.user, params.namespace);
		if (!is_admin) {
			return;
		}

		if (email === locals.user.email) {
			await prisma.$transaction(async (prisma) => {
				const admin_count = await prisma.membership.count({
					where: {
						role: "admin",
						team: {
							namespace: {
								name: params.namespace,
							},
						},
					},
				});

				if (admin_count <= 1) {
					console_log("Cannot downgrade yourself, you are the only admin");
					return { count: 0 };
				}

				await prisma.membership.updateMany({
					where: {
						user: {
							email: email,
						},
						team: {
							namespace: {
								name: params.namespace,
							},
						},
					},
					data: {
						role: role,
					},
				});
				log(`User "${email}" changed role to "${role}"`, email, params.namespace);
			});
			throw redirect(302, `/@${params.namespace}/member`);
		}

		const result = await prisma.membership.updateMany({
			where: {
				user: {
					email: email,
				},
				team: {
					namespace: {
						name: params.namespace,
					},
				},
			},
			data: {
				role: role,
			},
		});

		if (result.count === 0) {
			console_log("No one changed role");
			throw error(400, "No one changed role");
		} else if (result.count > 1) {
			console_log("Something went wrong, more than one user changed role");
			throw error(500, "Something went wrong, more than one user changed role");
		}
		log(`User "${email}" changed role to "${role}"`, locals.user.email, params.namespace);

		throw redirect(302, `/@${params.namespace}/member`);
	},
};
