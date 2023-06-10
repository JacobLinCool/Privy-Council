import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals }) => {
	console.log(locals);
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}

	// return all information belongs to user
	const info = await prisma.user.findUnique({
		where: {
			email: locals.token.sub,
		},
		select: {
			namespace_name: true,
		},
	});
	throw redirect(302, "/@" + info?.namespace_name + "/manage");

	return {};
};
