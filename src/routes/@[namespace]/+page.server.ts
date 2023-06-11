import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { verifyOwnNamespace } from "$lib/server/verify";

/*
output: {
	name:
	bio: 
	councilors: councilors,
	committees: committees,
	conversations: conversations,
	libraries: libraries,
	members/teams: users/members,
}
*/
export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}
	var admin = false;
	if (await verifyOwnNamespace(locals?.token?.sub, params.namespace)) {
		admin = true;
	}

	// find if params.namespace is in namespace
	const namespace = await prisma.namespace.count({
		where: {
			name: params.namespace,
		},
	});
	// if namespace is NULL, then throw error
	if (namespace === 0) {
		// redirect to /@[params.namespace]
		throw redirect(302, "/");
	}

	// return all information belongs to user
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
	//console.log("userInfo:", userInfo);

	if (userInfo?.namespace_name != params.namespace) {
		// find if params.namespace is in teams
		const team = await prisma.team.findMany({
			where: {
				namespace_name: params.namespace,
			},
			select: {
				name: true,
				bio: true,
				members: {
					include: {
						user: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});
		//console.log('team[0]',team[0].members);

		// return all information belongs to the team
		const info = await prisma.namespace.findUnique({
			where: {
				name: params.namespace,
			},
			select: {
				councilors: true,
				committees: true,
				conversations: true,
				libraries: true,
			},
		});

		const updatedJsonObject = {
			name: team[0]?.name,
			bio: team[0]?.bio,
			councilors: info?.councilors,
			committees: info?.committees,
			conversations: info?.conversations,
			libraries: info?.libraries,
			members: team[0]?.members,
		};
		//console.log(updatedJsonObject);
		return { admin: admin, data: updatedJsonObject };
	} else {
		const updatedJsonObject = {
			name: userInfo?.name,
			bio: userInfo?.bio,
			councilors: userInfo?.namespace.councilors,
			committees: userInfo?.namespace.committees,
			conversations: userInfo?.namespace.conversations,
			libraries: userInfo?.namespace.libraries,
			team: userInfo?.teams,
		};
		//console.log(updatedJsonObject);
		return { admin: admin, data: updatedJsonObject };
	}
};
