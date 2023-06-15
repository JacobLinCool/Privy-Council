<script lang="ts">
	import { t } from "svelte-i18n";
	import Markdown from "svelte-markdown";
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="w-full max-w-4xl">
		<div class="prose mb-8">
			<h1>{$t("create-new-library.title")}</h1>
		</div>
		<div class="flex w-full gap-4 max-sm:flex-col-reverse">
			<form method="POST" class="flex flex-1 flex-col gap-4">
				<label>
					{$t("name")}
					<input name="name" type="text" class="input w-full" />
				</label>
				<button class="btn-primary btn">{$t("create")}</button>
			</form>
			<div class="prose max-w-sm">
				<Markdown source={$t("create-new-library.description")} />
			</div>
		</div>
	</div>
</div>
