import { log } from "$lib/server/log";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const library = await prisma.library.findUnique({
		where: {
			id: parseInt(params.id),
		},
		include: {
			data: true,
		},
	});
	if (!library) {
		throw redirect(302, `/@${params.namespace}`);
	}

	if (library.namespace_name !== params.namespace) {
		throw redirect(302, `/@${library.namespace_name}/councilor/${params.id}`);
	}

	if (!is_namespace_editable(locals.user, params.namespace) && library.visibility === false) {
		throw redirect(302, `/@${params.namespace}`);
	}

	console.log(library);
	return { library };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const library = await prisma.library.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!library) {
			return;
		}

		if (!is_namespace_editable(locals.user, library.namespace_name)) {
			return;
		}

		await prisma.library.delete({
			where: {
				id: parseInt(params.id),
			},
		});

		// create log
		log(`Delete Library "${library.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${library.namespace_name}/manage`);
	},
	save: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		//const data_content = ["apple","cherry","durian","eggplant","fig","grape"];
		const data = await request.formData();
		const data_content = data.getAll("data_content").map((content) => content.toString());
		if (!data_content) {
			return;
		}

		const library = await prisma.library.findUnique({
			where: {
				id: parseInt(params.id),
			},
			include: {
				data: true,
			},
		});
		if (!library) {
			return;
		}

		if (!is_namespace_editable(locals.user, library.namespace_name)) {
			return;
		}

		// connect data in data_content
		await prisma.library.update({
			where: {
				id: library.id,
			},
			data: {
				data: {
					disconnect: library.data
						.filter((data) => {
							return !data_content.includes(data.content);
						})
						.map((data) => {
							return {
								id: data.id,
							};
						}),
					connectOrCreate: data_content.map((content) => {
						return {
							where: {
								content: content,
							},
							create: {
								content: content,
							},
						};
					}),
				},
			},
		});

		log(`Update Library "${library.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${library.namespace_name}/library/${params.id}`);
	},
	clone: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		// get the namespace of the councilor
		const library = await prisma.library.findUnique({
			where: {
				id: parseInt(params.id),
			},
			include: {
				data: true,
			},
		});
		if (!library) {
			return;
		}

		if (!is_namespace_editable(locals.user, library.namespace_name)) {
			return;
		}

		// verify if clone destination is in user's own namespace
		const data = await request.formData();
		const to_namespace = data.get("namespace")?.toString();
		if (!to_namespace) {
			return;
		}

		if (!is_namespace_editable(locals.user, to_namespace)) {
			return;
		}

		const cloned_library = await prisma.library.create({
			data: {
				name: library.name,
				visibility: library.visibility,
				namespace: {
					connect: {
						name: to_namespace,
					},
				},
				data: {
					connect: library.data.map((data) => {
						return {
							id: data.id,
						};
					}),
				},
			},
		});

		log(`Create Councilor "${cloned_library.name}"`, locals.user.email, to_namespace);
		throw redirect(302, `/@${to_namespace}/library/${cloned_library.id}`);
	},
};
