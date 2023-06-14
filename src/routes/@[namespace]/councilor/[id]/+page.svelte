<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";
	import Icon from "@iconify/svelte";
	import Model from "$lib/component/Model.svelte";

	export let data: PageData;

	let edit_mode = false;
	const base_model_list = [
		"gpt-3.5-turbo-0613",
		// "gpt-3.5-turbo-16k",
		// "gpt-3.5-turbo-16k-0613",
		// "gpt-4",
	];
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<h5>{$t("councilor")}</h5>

		<div>
			{#if edit_mode}
				<form method="POST" action="?/save" class="flex flex-col gap-4">
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

					<button class="btn-success btn-outline btn">
						{$t("save")}
						<Icon icon="octicon:check-16" class="ml-1 inline-block" />
					</button>
				</form>
			{:else}
				<div class="absolute right-0 top-0 z-10 mb-4 flex flex-none flex-row space-x-4">
					<Model>
						<button slot="opener" class="btn-outline btn-error btn-square btn">
							<Icon icon="octicon:trash-16" />
						</button>
						<div slot="body">
							<p>
								{$t("delete-confirm")}
							</p>
							<form method="POST" action="?/delete">
								<button class="btn-outline btn-error btn">
									{$t("i-am-sure")}
									<Icon icon="octicon:trash-16" />
								</button>
							</form>
						</div>
					</Model>
					<button
						class="btn-info btn-outline btn-square btn"
						on:click={() => (edit_mode = !edit_mode)}
					>
						<Icon icon="octicon:pencil-16" />
					</button>
					<Model>
						<button slot="opener" class="btn-accent btn-outline btn-square btn">
							<Icon icon="octicon:repo-forked-16" />
						</button>
						<form
							slot="body"
							class="flex flex-col gap-4"
							method="POST"
							action="?/clone"
						>
							<label class="label" for=""> Namespace </label>
							<select name="namespace" class="select w-full">
								{#each data.editables as namespace}
									<option>{namespace}</option>
								{/each}
							</select>

							<button class="btn-success btn-outline btn">
								{$t("clone")}
								<Icon icon="octicon:repo-forked-16" class="ml-1 inline-block" />
							</button>
						</form>
					</Model>
				</div>

				<h1>{data.councilor.name}</h1>

				<h3>{data.councilor.model}</h3>
				<textarea
					class="textarea-bordered textarea-ghost textarea w-full"
					name="bio"
					rows="4"
					bind:value={data.councilor.trait}
					disabled
				/>
			{/if}
		</div>
	</div>
</div>
