<script lang="ts">
	import { page } from "$app/stores";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const is_personal = data.namespace.user == null ? false : true;
	const name = data.namespace.user?.name || data.namespace.team?.name || "";
</script>

<div class="flex h-full w-full justify-center overflow-auto px-4 py-24">
	<div class="prose w-full">
		{#if is_personal}
			<h5>Personal</h5>
		{:else}
			<h5>Team</h5>
		{/if}
		<a class="contents" href="/@{$page.params.namespace}">
			<h1>{name}</h1>
		</a>
		<!-- <div>
			<input type="text" placeholder="Search" class="input w-full max-w-xs" />
			<button class="btn">{$t("search")}</button>
		</div> -->
		<div>
			<h2>
				{$t("councilor")}
			</h2>

			<div class="divider" />

			<div class="carousel w-full space-x-4 p-4">
				<a
					class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/councilor/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
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
			</div>
		</div>
		<div>
			<h2>
				{$t("committee")}
			</h2>

			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				<a
					class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/committee/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
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
			</div>
		</div>
		<div>
			<h2>
				{$t("library")}
			</h2>
			<div class="divider" />
			<div class="carousel w-full space-x-4 p-4">
				<a
					class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
					href="/@{$page.params.namespace}/library/new"
				>
					<div class="card-body flex items-center justify-center">
						<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
					</div>
				</a>
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
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/create-team"
					>
						<div class="card-body flex items-center justify-center">
							<Icon icon="octicon:plus-16" class="inline-block text-xl font-bold" />
						</div>
					</a>
					{#each data.namespace.user.memberships as membership}
						<a
							class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
							href="/@{membership.team.namespace_name}/manage"
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
					<a
						class="carousel-item card-bordered card card-compact w-56 bg-base-200 no-underline shadow-sm transition-all hover:shadow-md"
						href="/@{$page.params.namespace}/member"
					>
						<div class="card-body flex flex-col items-center justify-center">
							<h3>{$t("manage")}</h3>
						</div>
					</a>
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
				</div>
			</div>
		{/if}
	</div>
</div>
