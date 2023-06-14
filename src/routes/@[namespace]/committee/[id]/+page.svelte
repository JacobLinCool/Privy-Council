<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";

	export let data: PageData;

	let edit_mode = false;
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<h5>{$t("committee")}</h5>
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
					bind:value={data.committee.name}
				/>

				<textarea
					class="textarea-bordered textarea-ghost textarea w-full transition-all hover:input-primary"
					name="trait"
					rows="4"
					bind:value={data.committee.trait}
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
			<h5>{$t("committee")}</h5>
			<h1>{data.committee.name}</h1>

			<h3>{data.committee.model}</h3>
			<textarea
				class="textarea-bordered textarea-ghost textarea w-full transition-all hover:input-primary"
				name="bio"
				rows="4"
				bind:value={data.committee.trait}
				disabled
			/>
		{/if}
	</div>
</div>
