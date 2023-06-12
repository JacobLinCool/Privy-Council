import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/");
	}

	throw redirect(302, `/@${locals.user.namespace_name}/manage`);
};
