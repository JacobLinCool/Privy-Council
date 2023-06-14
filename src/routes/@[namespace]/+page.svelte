<script lang="ts">
	import { page } from "$app/stores";
	import { t } from "svelte-i18n";
	import Markdown from "svelte-markdown";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const is_personal = data.namespace.user == null ? false : true;

	let edit_mode = false;
	let name = data.namespace.user?.name || data.namespace.team?.name || "";
	let bio = data.namespace.user?.bio || data.namespace.team?.bio || "";
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<div class="w-full break-words">
			{#if is_personal}
				<h5>Personal</h5>
			{:else}
				<h5>Team</h5>
			{/if}
			<form method="POST" class="flex w-full items-start justify-between gap-4">
				<div class="flex-1">
					{#if edit_mode}
						<input
							type="text"
							name="name"
							class="input-bordered input-ghost input mb-4 w-full text-xl font-bold transition-all hover:input-primary"
							bind:value={name}
						/>
						<br />
						<textarea
							class="textarea-bordered textarea-ghost textarea w-full transition-all hover:input-primary"
							name="bio"
							rows="4"
							bind:value={bio}
						/>
					{:else}
						<h1>{name}</h1>
						<div class="max-h-40 overflow-auto">
							<Markdown source={bio} />
						</div>
					{/if}
				</div>
				{#if data.editables.includes(data.namespace.name)}
					<div class="flex flex-none flex-row">
						{#if edit_mode}
							<button class="btn-primary btn-outline btn-square btn">
								<Icon icon="octicon:check-16" />
							</button>
						{:else}
							<button
								type="button"
								on:click={() => (edit_mode = !edit_mode)}
								class="btn-ghost btn-outline btn-square btn"
							>
								<Icon icon="octicon:pencil-16" />
							</button>
						{/if}
					</div>
				{/if}
			</form>
		</div>
		<div>
			<h2>
				{$t("councilor")}
			</h2>

			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				{#each data.namespace.councilors as councilor}
					<a
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/councilor/{councilor.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{councilor.name}</p>
							<p class="text-sm">{councilor.model}</p>
						</div>
					</a>
				{/each}
				{#if data.namespace.councilors.length === 0}
					<div
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{$t("no-item")}</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div>
			<h2>
				{$t("committee")}
			</h2>

			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				{#each data.namespace.committees as committee}
					<a
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/committee/{committee.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{committee.name}</p>
							<p class="text-sm">{committee.visibility ? "public" : "private"}</p>
						</div>
					</a>
				{/each}
				{#if data.namespace.committees.length === 0}
					<div
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{$t("no-item")}</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div>
			<h2>
				{$t("library")}
			</h2>
			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				{#each data.namespace.libraries as library}
					<a
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/library/{library.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{library.name}</p>
							<p class="text-sm">{library.visibility ? "public" : "private"}</p>
						</div>
					</a>
				{/each}
				{#if data.namespace.libraries.length === 0}
					<div
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{$t("no-item")}</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
		{#if data.namespace.user}
			<div>
				<h2>
					{$t("team")}
				</h2>
				<div class="divider" />
				<div class="carousel w-full space-x-4 p-4">
					{#each data.namespace.user.memberships as membership}
						<a
							class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
							href="/@{membership.team.namespace_name}"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{membership.team.name}</p>
								<p class="text-sm">{membership.role}</p>
							</div>
						</a>
					{/each}
					{#if data.namespace.user.memberships.length === 0}
						<div
							class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{$t("no-item")}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if data.namespace.team}
			<div>
				<h2>
					{$t("member")}
				</h2>
				<div class="divider" />
				<div class="carousel w-full space-x-4 p-4">
					{#each data.namespace.team.memberships as membership}
						<a
							class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
							href="/@{membership.user.namespace_name}"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{membership.user.name}</p>
								<p class="text-sm">{membership.role}</p>
							</div>
						</a>
					{/each}
					{#if data.namespace.team.memberships.length === 0}
						<div
							class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{$t("no-item")}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
