<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";

	export let data: PageData;

	let edit_mode = false;
	const base_model_list = [
		"gpt-3.5-turbo",
		"gpt-3.5-turbo-16k",
		"gpt-3.5-turbo-16k-0613",
		"gpt-4",
	]; // for test
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<h5>{$t("councilor")}</h5>
		{#if edit_mode}
			<form method="POST" action="?/save">
				<div class="mb-4 flex flex-none flex-row space-x-4">
					<button class="btn-primary btn-outline btn">
						{$t("save")}
					</button>
				</div>
				<input
					type="text"
					name="name"
					class="input-bordered input-ghost input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
					bind:value={data.councilor.name}
				/>
				<select
					name="base_model"
					class="select w-full max-w-xs"
					bind:value={data.councilor.model}
				>
					{#each base_model_list as model}
						<option>{model}</option>
					{/each}
				</select>
				<textarea
					class="textarea-bordered textarea-ghost textarea w-full transition-all hover:input-primary"
					name="trait"
					rows="4"
					bind:value={data.councilor.trait}
				/>
			</form>
		{:else}
			<div class="mb-4 flex flex-none flex-row space-x-4">
				<form method="POST" action="?/delete">
					<button class="btn-primary btn-outline btn">
						{$t("delete")}
					</button>
				</form>
				<button
					class="btn-primary btn-outline btn"
					on:click={() => (edit_mode = !edit_mode)}
				>
					{$t("edit")}
				</button>
				<form method="POST" action="?/clone">
					<button class="btn-primary btn-outline btn">
						{$t("clone")}
					</button>
				</form>
			</div>
			<h5>{$t("councilor")}</h5>
			<h1>{data.councilor.name}</h1>

			<h3>{data.councilor.model}</h3>
			<textarea
				class="textarea-bordered textarea-ghost textarea w-full transition-all hover:input-primary"
				name="bio"
				rows="4"
				bind:value={data.councilor.trait}
				disabled
			/>
		{/if}
	</div>
</div>
