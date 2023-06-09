<script lang="ts">
	import { page } from "$app/stores";

	export let title = "Privy Council LLM";
	export let description =
		"Privy Council LLM is an AI dialogue generation platform that enables users to create and manage multiple AI characters for more reliable and complex conversations.";
	export let image = `${$page.url.origin}/banner.jpg`;

	function ellipsis(str: string, len: number) {
		if (str.length <= len) {
			return str;
		}

		const words = str.split(" ");
		let result = "";
		for (const word of words) {
			if (result.length + word.length > len) {
				break;
			}
			result += word + " ";
		}
		return result + "...";
	}
</script>

<svelte:head>
	{#if title}
		<title>{title} | Privy Council LLM</title>
	{:else}
		<title>Privy Council LLM</title>
	{/if}
	<meta name="description" content={ellipsis(description.replace(/\n/g, " "), 240)} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
