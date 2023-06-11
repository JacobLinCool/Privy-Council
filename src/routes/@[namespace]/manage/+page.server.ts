import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { verifyOwnNamespace } from "$lib/server/verify";

/*
output: {
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
	if (!(await verifyOwnNamespace(locals?.token?.sub, params.namespace))) {
		throw redirect(302, "/@" + params.namespace);
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
		// find if params.namespace is in users's teams.team.namespace_name
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
		//console.log("team:", team);

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
			councilors: info?.councilors,
			committees: info?.committees,
			conversations: info?.conversations,
			libraries: info?.libraries,
			members: team?.members,
		};
		//console.log(updatedJsonObject);
		return { updatedJsonObject };
	} else {
		const updatedJsonObject = {
			councilors: userInfo?.namespace.councilors,
			committees: userInfo?.namespace.committees,
			conversations: userInfo?.namespace.conversations,
			libraries: userInfo?.namespace.libraries,
			teams: userInfo?.teams,
		};
		//console.log(updatedJsonObject);
		return { updatedJsonObject };
	}
};
