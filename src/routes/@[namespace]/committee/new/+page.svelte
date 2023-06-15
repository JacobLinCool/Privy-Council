<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";

	export let data: PageData;
	let councilor_list = data.councilors!;
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="w-full max-w-2xl">
		<div class="prose mb-8">
			<h1>{$t("create-new-committee.title")}</h1>
		</div>
		<div class="flex w-full gap-4 max-sm:flex-col-reverse">
			<form method="POST" class="flex flex-1 flex-col gap-4">
				<label>
					{$t("name")}
					<input name="name" type="text" class="input w-full" />
				</label>
				<label>
					{$t("lead")}
					<select name="lead" class="select w-full">
						<option disabled selected />
						{#each councilor_list as councilor}
							<option>{councilor.name}</option>
						{/each}
					</select>
				</label>
				<label>
					{$t("member")}
					<select name="member" class="select w-full">
						<option disabled selected />
						{#each councilor_list as councilor}
							<option>{councilor.name}</option>
						{/each}
					</select>
				</label>
				<button class="btn-primary btn">{$t("create")}</button>
			</form>
			<p class="w-40">{$t("create-new-committee.description")}</p>
		</div>
	</div>
</div>
