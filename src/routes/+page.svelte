<script lang="ts">
	import { t } from "svelte-i18n";
	import { page } from "$app/stores";
	import Head from "$lib/component/Head.svelte";
	import type { Route } from "@playwright/test";
	import type { PageData } from "./$types";

	const callback = new URL("/auth", $page.url).toString();
	export let data: PageData;
	const try_btn_link =
		data.user == null
			? `https://pea.csie.cool/app/privy-council-llm?cb=${callback}`
			: `/@${data.user.namespace_name}/manage`;
</script>

<Head />

<div class="flex h-full w-full items-center justify-center">
	<div class="prose">
		<h1>{$t("welcome")}</h1>
		<p>{$t("with-tech")}</p>

		<hr />

		<a class="btn-primary btn" href={try_btn_link}>
			{$t("intro.try-it-out")}
		</a>
	</div>
</div>
