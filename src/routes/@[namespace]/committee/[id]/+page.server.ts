import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { log } from "$lib/server/log";

export const load: PageServerLoad = async ({ params, locals }) => {
	// TODO: Not Sure Frontend
	const committee = await prisma.committee.findUnique({
		where: {
			id: parseInt(params.id),
		},
		include: {
			speaker: true,
			councilors: {
				include: {
					slots: {
						where: {
							committee_id: parseInt(params.id),
						},
						select: {
							library: true,
						},
					},
				},
			},
		},
	});
	if (!committee) {
		throw redirect(302, `/@${params.namespace}`);
	}

	if (committee.namespace_name !== params.namespace) {
		throw redirect(302, `/@${committee.namespace_name}/committee/${params.id}`);
	}

	if (!is_namespace_editable(locals.user, params.namespace) && committee.visibility === false) {
		throw redirect(302, `/@${params.namespace}`);
	}

	const libraries = await prisma.namespace.findUnique({
		where: {
			name: params.namespace,
		},
		select: {
			libraries: true,
		},
	});

	return { committee: committee, libraries: libraries?.libraries };
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const committee = await prisma.committee.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!committee) {
			return;
		}

		if (!is_namespace_editable(locals.user, committee.namespace_name)) {
			return;
		}

		await prisma.committee.delete({
			where: {
				id: parseInt(params.id),
			},
		});

		// create log
		log(`Delete Committee "${committee.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${committee.namespace_name}/manage`);
	},
	save: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const name = "test";
		const lead = 4;
		const councilor = [1, 4, 10];
		const library = [1, 2, 3];
		/*const data = await request.formData();
		const name = data.get("name")?.toString();
		const base_model = data.get("base_model")?.toString();
		const trait = data.get("trait")?.toString();
		if (!name || !base_model || !trait) {
			return;
		}*/

		const committee = await prisma.committee.findUnique({
			where: {
				id: parseInt(params.id),
			},
		});
		if (!committee) {
			return;
		}

		if (!is_namespace_editable(locals.user, committee.namespace_name)) {
			return;
		}

		// update the councilor

		await prisma.committee.update({
			where: {
				id: parseInt(params.id),
			},
			data: {
				name: name,
				speaker: {
					connect: {
						id: lead,
					},
				},
				councilors: {
					set: councilor.map((id) => ({ id })),
				},
			},
		});

		await prisma.slot.deleteMany({
			where: {
				committee_id: parseInt(params.id),
			},
		});
		for (let i = 0; i < councilor.length; i++) {
			if (!library[i]) continue;
			await prisma.slot.create({
				data: {
					committee: { connect: { id: parseInt(params.id) } },
					councilor: { connect: { id: councilor[i] } },
					library: { connect: { id: library[i] } },
				},
			});
		}

		log(`Update Committee "${committee.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${committee.namespace_name}/committee/${params.id}`);
	},
	clone: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		// get the namespace of the committee
		const committee = await prisma.committee.findUnique({
			where: {
				id: parseInt(params.id),
			},
			include: {
				speaker: true,
			},
		});
		if (!committee) {
			return;
		}

		if (!is_namespace_editable(locals.user, committee.namespace_name)) {
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

		const cloned_committee = await prisma.committee.create({
			data: {
				name: committee.name,
				visibility: committee.visibility,
				namespace: {
					connect: {
						name: to_namespace,
					},
				},
				speaker: {
					create: {
						name: committee.speaker.name,
						visibility: committee.speaker.visibility,
						model: committee.speaker.model,
						trait: committee.speaker.trait,
						namespace_name: to_namespace,
					},
				},
			},
		});

		log(`Create Committee "${cloned_committee.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${to_namespace}/committee/${cloned_committee.id}`);
	},
	start: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}
		// get the namespace of the committee
		const committee = await prisma.committee.findUnique({
			where: {
				id: parseInt(params.id),
			},
			include: {
				speaker: true,
			},
		});
		if (!committee) {
			return;
		}

		if (!is_namespace_editable(locals.user, committee.namespace_name)) {
			return;
		}

		// verify if clone destination is in user's own namespace
		const data = await request.formData();
		const input = data.get("input")?.toString();
		if (!input) {
			return;
		}

		//const final = await start_conversation(input, params.id);
		const final = "Hello World";

		const conversation = await prisma.conversation.create({
			data: {
				input: input,
				immediate: "",
				final: final,
				namespace: {
					connect: {
						name: committee.namespace_name,
					},
				},
				committee: {
					connect: {
						id: parseInt(params.id),
					},
				},
			},
		});

		log(`Create Conversation on "${committee.name}"`, locals.user.email, params.namespace);
		throw redirect(302, `/@${committee.namespace_name}/conversation/${conversation.id}`);
	},
};
