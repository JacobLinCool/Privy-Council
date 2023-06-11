import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { to_number } from "svelte/internal";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}

	// get the namespace of the councilor
	const councilor = await prisma.councilor.findUnique({
		where: {
			id: to_number(params.id),
		},
	});

	// --- verify started ---
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

	// if councilor not belongs to user or his team, throw error
	if (userInfo?.namespace_name != councilor?.namespace_name) {
		let found = false;
		userInfo?.teams.forEach((team) => {
			if (team.namespace_name === councilor?.namespace_name) {
				found = true;
			}
		});
		if (!found) {
			throw redirect(302, "/");
		}
	}
	// --- verify ended ---

	// return councilor information
	console.log("councilor:", councilor);
	return { councilor };
};

/** @type {import('./$types').Actions} */
export const actions = {
	delete: async ({ locals, params }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});

		// --- verify started ---
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

		// if councilor not belongs to user or his team, throw error
		if (userInfo?.namespace_name != councilor?.namespace_name) {
			let found = false;
			userInfo?.teams.forEach((team) => {
				if (team.namespace_name === councilor?.namespace_name) {
					found = true;
				}
			});
			if (!found) {
				throw redirect(302, "/");
			}
		}
		// --- verify ended ---

		// delete councilor
		await prisma.councilor.delete({
			where: {
				id: to_number(params.id),
			},
		});

		throw redirect(302, "/@" + councilor?.namespace_name + "/manage");
		return {};
	},
	save: async ({ locals, params, request }) => {
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

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});

		// --- verify started ---
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

		// if councilor not belongs to user or his team, throw error
		if (userInfo?.namespace_name != councilor?.namespace_name) {
			let found = false;
			userInfo?.teams.forEach((team) => {
				if (team.namespace_name === councilor?.namespace_name) {
					found = true;
				}
			});
			if (!found) {
				throw redirect(302, "/");
			}
		}
		// --- verify ended ---

		// update the councilor
		await prisma.councilor.update({
			where: {
				id: to_number(params.id),
			},
			data: {
				name: name,
				model: baseModel,
				trait: trait,
			},
		});

		throw redirect(302, "/@" + councilor?.namespace_name + "/councilor/" + params.id);
		return {};
	},
	clone: async ({ locals, params }) => {
		if (!locals?.token?.sub) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const councilor = await prisma.councilor.findUnique({
			where: {
				id: to_number(params.id),
			},
		});

		// --- verify started ---
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

		// if councilor not belongs to user or his team, throw error
		if (userInfo?.namespace_name != councilor?.namespace_name) {
			let found = false;
			userInfo?.teams.forEach((team) => {
				if (team.namespace_name === councilor?.namespace_name) {
					found = true;
				}
			});
			if (!found) {
				throw redirect(302, "/");
			}
		}
		// --- verify ended ---

		// clone the councilor

		throw redirect(302, "/@" + councilor?.namespace_name + "/councilor/" + params.id);
		return {};
	},
};
