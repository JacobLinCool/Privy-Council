<script lang="ts">
	import Model from "$lib/component/Model.svelte";
	import { t } from "svelte-i18n";
	import Markdown from "svelte-markdown";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	let edit_mode = false;
	const base_model_list = [
		"gpt-3.5-turbo-0613",
		// "gpt-3.5-turbo-16k",
		// "gpt-3.5-turbo-16k-0613",
		// "gpt-4",
	];

	let question = "";
	let answer = "";
	let asking = false;
	async function ask(evt: KeyboardEvent) {
		if (asking) {
			return;
		}
		if (evt.key !== "Enter") {
			return;
		}
		asking = true;
		const res = await fetch("/ask", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ question, councilor: data.councilor }),
		});
		const { answer: ans } = await res.json();
		answer = ans;
		asking = false;
	}
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

				<h1>{data.councilor.name}</h1>

				<h3>{data.councilor.model}</h3>
				<textarea
					class="textarea-bordered textarea-ghost textarea w-full"
					name="trait"
					rows="4"
					bind:value={data.councilor.trait}
					disabled
				/>

				{#if data.user}
					<div class="divider" />

					<div class="chat chat-start">
						<div class="chat-bubble">
							{"Hi! I am a " +
								data.councilor.name +
								", and my trait is " +
								data.councilor.trait +
								". "}
						</div>
					</div>
					<div class="chat chat-end">
						<div class="chat-bubble chat-bubble-info">
							{#if !answer}
								<input
									class="input-ghost input input-sm focus:outline-none focus:ring-0"
									style="--tw-bg-opacity: 0.05; --tw-border-opacity: 0;"
									bind:value={question}
									on:keyup={ask}
									disabled={!!answer || asking}
									class:animate-pulse={asking}
								/>
							{:else}
								{question}
							{/if}
						</div>
					</div>
					{#if answer}
						<div class="chat chat-start">
							<div class="chat-bubble prose">
								<Markdown source={answer} />
							</div>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</div>
