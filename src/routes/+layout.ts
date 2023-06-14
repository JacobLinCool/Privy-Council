import { browser } from "$app/environment";
import "$lib/i18n";
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	if (data.user) {
		return {
			...data,
			editables: [
				data.user.namespace_name,
				data.user.memberships.map((m) => m.team.namespace_name),
			].flat(),
			owned: [
				data.user.namespace_name,
				data.user.memberships
					.filter((m) => m.role === "admin")
					.map((m) => m.team.namespace_name),
			].flat(),
		};
	} else {
		return { ...data, editables: [], owned: [] };
	}
};
