<script lang="ts">
	import { t } from "svelte-i18n";

	export let data;
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="prose h-full w-full overflow-auto py-20">
		<h1>Newly Created</h1>
		<div>
			<h2>
				{$t("councilor")}
			</h2>

			<div class="flex flex-col gap-4">
				{#each data.councilors as councilor}
					<a
						class="contents"
						href="/@{councilor.namespace_name}/councilor/{councilor.id}"
					>
						<div class="card bg-base-100 shadow-md transition-all hover:shadow-lg">
							<div class="card-body">
								<span class="card-title">{councilor.name}</span>
								<span>{councilor.trait}</span>
								<span class="opacity-60"
									>Created by {councilor.namespace.user?.name ||
										councilor.namespace.team?.name} (@{councilor.namespace_name})</span
								>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
