<script lang="ts">
	import { t } from "svelte-i18n";

	const base_model_list = [
		"gpt-3.5-turbo-0613",
		// "gpt-3.5-turbo-16k",
		// "gpt-3.5-turbo-16k-0613",
		// "gpt-4",
	];
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="w-full max-w-2xl">
		<div class="prose mb-8">
			<h1>{$t("create-new-councilor.title")}</h1>
		</div>
		<div class="flex w-full gap-4 max-sm:flex-col-reverse">
			<form method="POST" class="flex flex-1 flex-col gap-4">
				<label>
					{$t("name")}
					<input name="name" type="text" class="input w-full" />
				</label>
				<label>
					{$t("base-model")}
					<select name="base_model" class="select w-full">
						<option disabled selected />
						{#each base_model_list as model}
							<option>{model}</option>
						{/each}
					</select>
				</label>
				<label>
					{$t("trait")}
					<textarea class="textarea w-full" name="trait" rows="4" />
				</label>
				<button class="btn-primary btn">{$t("create")}</button>
			</form>
			<p class="w-40">{$t("create-new-councilor.description")}</p>
		</div>
	</div>
</div>
