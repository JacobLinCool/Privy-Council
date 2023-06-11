import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}
	const userInfo = await prisma.user.findUnique({
		where: {
			email: locals.token.sub,
		},
		select: {
			namespace_name: true,
			teams: {
				select: {
					namespace_name: true,
				},
			},
		},
	});
	//console.log("userInfo:", userInfo);

	// if params.namespace is not in userInfo.teams.namespace_name,
	// and not in userInfo.namespace_name then throw error
	if (userInfo?.namespace_name != params.namespace) {
		let found = false;
		userInfo?.teams.forEach((team) => {
			if (team.namespace_name === params.namespace) {
				found = true;
			}
		});
		if (!found) {
			throw redirect(302, "/");
		}
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	createcouncilor: async ({ locals, params, request }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}
		const data = await request.formData();
		const name = data.get("name")?.toString();
		const baseModel = data.get("baseModel")?.toString();
		const trait = data.get("trait")?.toString();
		if (name === undefined || baseModel === undefined || trait === undefined) {
			throw redirect(302, "/@" + params.namespace + "/councilor/new");
		}

		// return all information belongs to user
		const userInfo = await prisma.user.findUnique({
			where: {
				email: locals.token.sub,
			},
			select: {
				namespace_name: true,
				teams: {
					select: {
						namespace_name: true,
					},
				},
			},
		});
		console.log("userInfo:", userInfo);
		// if params.namespace is not in userInfo.teams.namespace_name,
		// and not in userInfo.namespace_name then throw error
		if (userInfo?.namespace_name != params.namespace) {
			let found = false;
			userInfo?.teams.forEach((team) => {
				if (team.namespace_name === params.namespace) {
					found = true;
				}
			});
			if (!found) {
				throw redirect(302, "/");
			}
		}

		// create the team
		const councilor = await prisma.councilor.create({
			data: {
				name: name,
				visibility: false,
				model: baseModel,
				trait: trait,
				namespace_name: params.namespace,
			},
		});

		// add the councilor to the namespace
		const nsUpdate = await prisma.namespace.update({
			where: {
				name: params.namespace,
			},
			data: {
				councilors: {
					connect: {
						id: councilor.id,
					},
				},
			},
		});

		throw redirect(302, "/@" + params.namespace + "/councilor/" + councilor.id);
		return {};
	},
};
