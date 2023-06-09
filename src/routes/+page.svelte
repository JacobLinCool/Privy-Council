<script lang="ts">
	import { t } from "svelte-i18n";
	import { page } from "$app/stores";
	import Head from "$lib/component/Head.svelte";

	const callback = new URL("/auth", $page.url).toString();
</script>

<Head />

<div class="flex h-full w-full items-center justify-center">
	<div class="prose">
		<h1>{$t("welcome")}</h1>
		<p>{$t("with-tech")}</p>

		<hr />

		<a class="btn-primary btn" href="https://pea.csie.cool/app/privy-council-llm?cb={callback}">
			{$t("intro.try-it-out")}
		</a>
	</div>
</div>
