import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { verifyOwnNamespace } from "$lib/server/verify";
import { log } from "$lib/server/log";

/*
output: {
	councilors: councilors,
	committees: committees,
	conversations: conversations,
	libraries: libraries,
	members/teams: users/members,
}
*/
// QQ 沒存到 member 的 role
export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}
	if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
		throw redirect(302, "/@" + params.namespace);
	}

	const userInfo = await prisma.user.findUnique({
		where: {
			email: locals.token.sub,
		},
		include: {
			namespace: {
				include: {
					councilors: true,
					committees: true,
					conversations: true,
					libraries: true,
				},
			},
			teams: true,
		},
	});
	if (userInfo?.namespace_name == params.namespace) {
		throw redirect(302, "/@" + params.namespace);
	}

	const team = await prisma.team.findUnique({
		where: {
			namespace_name: params.namespace,
		},
		select: {
			members: {
				include: {
					user: true,
				},
			},
		},
	});

	//console.log("team:", team?.members);

	// read log if user is admin, can't read log if user is not admin
	const logs = await prisma.team.findUnique({
		where: {
			namespace_name: params.namespace,
		},
		select: {
			logs: {
				select: {
					id: true,
					content: true,
					time: true,
					user: true,
				},
			},
		},
	});
	console.log("logs:", logs?.logs);

	// check if user is admin in the team
	const isAdmin = await prisma.team.findUnique({
		where: {
			namespace_name: params.namespace,
		},
		select: {
			members: {
				where: {
					user_id: userInfo?.id,
					role: "admin",
				},
			},
		},
	});
	if (isAdmin?.members.length === 0) {
		return { admin: false, teams: team?.members, logs: null };
	}
	return { admin: true, teams: team?.members, logs: logs?.logs };
};

/** @type {import('./$types').Actions} */
export const actions = {
	leave: async ({ locals, params, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
			throw redirect(302, "/@" + params.namespace);
		}

		const data = await request.formData();
		const email = data.get("email")?.toString();
		if (email === undefined) {
			throw redirect(302, "/@" + params.namespace + "/member");
		}
		// check if user is admin in the team
		const userInfo = await prisma.user.findUnique({
			where: {
				email: locals?.token?.sub,
			},
		});
		const isAdmin = await prisma.team.findUnique({
			where: {
				namespace_name: params.namespace,
			},
			select: {
				members: {
					where: {
						user_id: userInfo?.id,
						role: "admin",
					},
				},
			},
		});
		// check if delete email is exist in user
		const delUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (delUser === null) {
			throw redirect(302, "/@" + params.namespace + "/member");
		} else if (isAdmin?.members.length === 0 && email !== locals?.token?.sub) {
			throw redirect(302, "/@" + params.namespace + "/member");
		}

		// delete user where email = email from the team member
		const userid = await prisma.user.findUnique({
			where: {
				email: email,
			},
			select: {
				id: true,
				name: true,
			},
		});
		const teamid = await prisma.team.findUnique({
			where: {
				namespace_name: params.namespace,
			},
			select: {
				id: true,
			},
		});

		await prisma.teamMember.deleteMany({
			where: {
				user_id: userid?.id,
				team_id: teamid?.id,
			},
		});

		// create log
		log('Leave Team member "' + userid?.name + '"', locals?.token?.sub, params.namespace);
		if (email === locals?.token?.sub) {
			throw redirect(302, "/");
		}
		throw redirect(302, "/@" + params.namespace + "/member");
		return { success: true };
	},
	deleteteam: async ({ locals, params }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
			throw redirect(302, "/@" + params.namespace);
		}

		// check if user is admin in the team
		const userInfo = await prisma.user.findUnique({
			where: {
				email: locals?.token?.sub,
			},
		});
		const isAdmin = await prisma.team.findUnique({
			where: {
				namespace_name: params.namespace,
			},
			select: {
				members: {
					where: {
						user_id: userInfo?.id,
						role: "admin",
					},
				},
			},
		});
		if (isAdmin?.members.length === 0) {
			throw redirect(302, "/@" + params.namespace + "/member");
		}
		const delTeam = await prisma.namespace.delete({
			where: {
				name: params.namespace,
			},
		});

		throw redirect(302, "/");
	},
};
