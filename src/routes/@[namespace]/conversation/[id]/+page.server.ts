import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import { log } from "$lib/server/log";

export const load: PageServerLoad = async ({ params, locals }) => {
	// TODO: Not Sure Frontend
	const conversation = await prisma.conversation.findUnique({
		where: {
			id: parseInt(params.id),
		},
	});
	if (!conversation) {
		throw redirect(302, `/@${params.namespace}`);
	}

	if (conversation.namespace_name !== params.namespace) {
		throw redirect(302, `/@${conversation.namespace_name}/conversation/${params.id}`);
	}

	if (!is_namespace_editable(locals.user, params.namespace)) {
		throw redirect(302, `/@${params.namespace}`);
	}

	return conversation;
};

export const actions: Actions = {
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		const conversation = await prisma.conversation.findUnique({
			where: {
				id: parseInt(params.id),
			},
			include: {
				committee: true,
			},
		});
		if (!conversation) {
			return;
		}

		if (!is_namespace_editable(locals.user, conversation.namespace_name)) {
			return;
		}

		await prisma.conversation.delete({
			where: {
				id: parseInt(params.id),
			},
		});

		// create log
		log(
			`Delete Conversation from Committee "${conversation.committee.name}"`,
			locals.user.email,
			params.namespace,
		);
		throw redirect(302, `/@${conversation.namespace_name}/manage`);
	},
};
