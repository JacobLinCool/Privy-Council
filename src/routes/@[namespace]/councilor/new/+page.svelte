<script lang="ts">
	import type { PageData } from "./$types";
	import { t } from "svelte-i18n";

	export let data: PageData;

	const base_model_list = ["GPT3", "GPT3.5", "GPT4"]; // for test
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="prose">
		<h1>{$t("create-new-councilor.title")}</h1>
		<form method="POST">
			<h2 style="padding-top:10%">
				{$t("name")}
				<input name="name" type="text" class="input w-full max-w-xs" />
			</h2>
			<h2 style="padding-top:10%">
				{$t("base-model")}
				<select name="base_model" class="select w-full max-w-xs">
					<option disabled selected />
					{#each base_model_list as model}
						<option>{model}</option>
					{/each}
				</select>
			</h2>
			<h2 style="padding-top:10%">
				{$t("trait")}
				<textarea
					class="textarea"
					name="trait"
					style="width:150%;height:150%;overflow-x:visible;overflow-y:visible;"
				/>
			</h2>
			<button class="btn">{$t("create")}</button>
		</form>
		<p>{$t("create-new-councilor.description")}</p>
	</div>
</div>
