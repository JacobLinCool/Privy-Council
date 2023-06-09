import { locale, waitLocale } from "svelte-i18n";
import type { Handle } from "@sveltejs/kit";
import { checkout } from "sveltekit-jwt";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	locale.set(lang);
	await waitLocale(lang);

	const token = await checkout(event);
	if (token) {
		event.locals = { ...event.locals, token };
	}

	const result = await resolve(event);
	return result;
};

process.on("SIGINT", () => {
	process.exit(0);
});

process.on("SIGTERM", () => {
	process.exit(0);
});
