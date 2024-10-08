import { log } from "$lib/server/log";
import { prisma } from "$lib/server/prisma";
import { is_namespace_editable } from "$lib/server/verify";
import debug from "debug";
import { error, redirect, Redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

const console_log = debug("app:councilor:new");

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}
	if (!is_namespace_editable(locals.user, params.namespace)) {
		throw redirect(302, "/");
	}

	// find all councilor the namespace has
	const councilors = await prisma.namespace.findUnique({
		where: {
			name: params.namespace,
		},
		select: {
			councilors: true,
		},
	});

	return { councilors: councilors?.councilors };
};

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(302, "/");
		}

		/*const name = "test";
		const lead = 3;
		const member = [1, 4];*/
		const data = await request.formData();
		const name = data.get("name")?.toString();
		// get the lead, and convert to int
		const lead = parseInt(data.get("lead")?.toString() ?? "");
		// get all member, and convert to the string, then convert to array of int
		const member = data.getAll("member").map((id) => parseInt(id.toString()));
		console_log(name, lead, member);
		if (!name || !lead || !member) {
			throw redirect(302, `/@${params.namespace}/committee/new`);
		}

		if (!is_namespace_editable(locals.user, params.namespace)) {
			throw redirect(302, "/");
		}

		// create the councilor
		// connect all member to the committee
		try {
			const committee = await prisma.committee.create({
				data: {
					name: name,
					visibility: true,
					namespace: {
						connect: {
							name: params.namespace,
						},
					},
					speaker: {
						connect: {
							id: lead,
						},
					},
					councilors: {
						connect: member.map((id) => ({ id })),
					},
				},
			});
			log(`Create Committee "${committee.name}"`, locals.user.email, params.namespace);
			throw redirect(302, `/@${params.namespace}/committee/${committee.id}`);
		} catch (err) {
			if (err && typeof err === "object" && "status" in err) {
				throw err;
			}
			console_log(err);
			throw error(400, "Committee create failed");
		}
	},
};
