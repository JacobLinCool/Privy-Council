import { prisma } from "$lib/server/prisma";
import { locale, waitLocale } from "svelte-i18n";
import { checkout } from "sveltekit-jwt";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	locale.set(lang);
	await waitLocale(lang);

	const token = await checkout(event);
	if (token) {
		event.locals = { ...event.locals, token };

		const user_info = await prisma.user.findUnique({
			where: {
				email: token.sub,
			},
			include: {
				memberships: {
					select: {
						role: true,
						team: { select: { namespace_name: true } },
					},
				},
			},
		});
		event.locals.user = user_info;
	} else {
		event.locals.user = null;
	}

	const result = await resolve(event);
	return result;
};

if (globalThis.process) {
	process.on("SIGINT", () => {
		process.exit(0);
	});

	process.on("SIGTERM", () => {
		process.exit(0);
	});
}
