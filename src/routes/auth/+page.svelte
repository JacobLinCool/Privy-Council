<script lang="ts">
	import { goto } from "$app/navigation";
	import Head from "$lib/component/Head.svelte";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";

	export let data: PageData;

	onMount(async () => {
		if (data.ok) {
			await goto("/home", { invalidateAll: true });
		}
	});
</script>

<Head />

<div class="flex h-full w-full items-center justify-center">
	{#if data.ok}
		<h1 class="animate-pulse text-2xl">{$t("auth.signing-in")}</h1>
	{:else}
		<h1 class="text-error">{$t("auth.invalid-token")}</h1>
	{/if}
</div>
