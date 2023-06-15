<script lang="ts">
	import { t } from "svelte-i18n";
	import Markdown from "svelte-markdown";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center overflow-auto px-4 py-20">
	<!-- <pre class="w-full overflow-auto">{JSON.stringify(data.conversation, null, 4)}</pre> -->
	<div class="h-full overflow-auto">
		<div class="chat chat-end" class:animate-pulse={!data.conversation.final}>
			<div class="chat-bubble chat-bubble-info">
				{data.conversation.input}
			</div>
		</div>

		<div class="chat chat-start">
			<div class="chat-bubble prose">
				<Markdown source={data.conversation.immediate} />
			</div>
		</div>

		{#if data.conversation.final}
			<div class="chat chat-start">
				<div class="chat-bubble prose">
					<Markdown source={data.conversation.final} />
				</div>
			</div>
		{/if}
	</div>
	<form method="POST" action="?/delete">
		<button class="btn-primary btn">{$t("delete")}</button>
	</form>
</div>
