<script lang="ts">
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	export let data: PageData;

	const is_personal = data.namespace.user == null ? false : true;
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		<div>
			<input type="text" placeholder="Search" class="input w-full max-w-xs" />
			<button class="btn">{$t("search")}</button>
		</div>
		<div>
			<h2>
				{$t("councilor")}
			</h2>

			<div class="divider" />

			<div class="carousel w-full space-x-4 p-4">
				<a
					class="card-bordered card w-40 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/councilor/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
				{#each data.namespace.councilors as councilor}
					<a
						class="card-bordered card bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/councilor/{councilor.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{councilor.name}</p>
							<p class="text-sm">{councilor.model}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
		<div>
			<h2>
				{$t("committee")}
			</h2>

			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				<a
					class="card-bordered card w-40 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/committee/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
				{#each data.namespace.committees as committee}
					<a
						class="card-bordered card bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/committee/{committee.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{committee.name}</p>
							<p class="text-sm">{committee.visibility ? "public" : "private"}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
		<div>
			<h2>
				{$t("library")}
			</h2>
			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				<a
					class="card-bordered card w-40 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/library/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
				{#each data.namespace.libraries as library}
					<a
						class="card-bordered card bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/library/{library.id}"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<p class="text-lg font-bold">{library.name}</p>
							<p class="text-sm">{library.visibility ? "public" : "private"}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
		{#if data.namespace.user}
			<div>
				<h2>
					{$t("team")}
				</h2>
				<div class="divider" />
				<div class="carousel w-full space-x-4 p-4">
					<a
						class="card-bordered card w-40 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/create-team"
					>
						<div class="card-body flex items-center justify-center">
							<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
						</div>
					</a>
					{#each data.namespace.user.memberships as membership}
						<a
							class="card-bordered card bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
							href="/@{membership.team.namespace_name}"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{membership.team.name}</p>
								<p class="text-sm">{membership.role}</p>
							</div>
						</a>
					{/each}
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
							class="card-bordered card bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
							href="/@{membership.user.namespace_name}"
						>
							<div class="card-body flex flex-col items-center justify-center">
								<p class="text-lg font-bold">{membership.user.name}</p>
								<p class="text-sm">{membership.role}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
