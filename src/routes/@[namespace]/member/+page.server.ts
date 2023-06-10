import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

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

	const team = await prisma.user.findFirst({
		select: {
			teams: {
				where: {
					namespace_name: params.namespace,
				},
				select: {
					users: true,
				},
			},
		},
	});
	console.log(team?.teams[0].users);
	// if team is NULL, then throw error
	/*if (team?.teams.length === 0) {
		// redirect to /@[params.namespace]
		throw redirect(302, "/@" + params.namespace);
	}

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
		members: team?.teams[0].users,
	};
	console.log(updatedJsonObject);
	return { updatedJsonObject };*/
	return {};
};
