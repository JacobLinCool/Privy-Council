import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.token?.sub) {
		throw redirect(302, "/");
	}

	return {};
};
