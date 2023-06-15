<script lang="ts">
	import Model from "$lib/component/Model.svelte";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	let edit_mode = false;
	let word_table = data.library.data;
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<h5>{$t("library")}</h5>

		<div>
			{#if edit_mode}
				<form method="POST" action="?/save" class="flex flex-col gap-4">
					<input
						type="text"
						name="name"
						class="input-bordered input-ghost input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
						bind:value={data.library.name}
					/>
					{#each word_table as word}
						<div class="flex flex-none flex-row">
							<input
								type="text"
								name="data_content[]"
								class="input-bordered input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
								bind:value={word}
							/>
							<button class="btn-error btn-square btn mx-4">
								<Icon icon="ph:x" class="ml-1 inline-block" />
							</button>
						</div>
					{/each}
					<div class="flex flex-none flex-row">
						<input
							type="text"
							name="data_content[]"
							class="input-bordered input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
							placeholder={$t("content")}
						/>
						<button class="btn-error btn-square btn mx-4">
							<Icon icon="ph:x" class="ml-1 inline-block" />
						</button>
					</div>
					<button class="btn-success btn-outline btn">
						{$t("save")}
						<Icon icon="octicon:check-16" class="ml-1 inline-block" />
					</button>
				</form>
			{:else}
				<div class="absolute right-0 top-0 z-10 mb-4 flex flex-none flex-row space-x-4">
					<Model>
						<button slot="opener" class="btn-error btn-outline btn-square btn">
							<Icon icon="octicon:trash-16" />
						</button>
						<div slot="body">
							<p>
								{$t("delete-confirm")}
							</p>
							<form method="POST" action="?/delete">
								<button class="btn-error btn-outline btn">
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
				<h1>{data.library.name}</h1>

				{#each word_table as word}
					<input
						type="text"
						name="name"
						class="input-bordered input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
						bind:value={word}
						disabled
					/>
				{/each}
			{/if}
		</div>
	</div>
</div>
