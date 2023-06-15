<script lang="ts">
	import { t } from "svelte-i18n";
	import Markdown from "svelte-markdown";
	import type { PageData } from "./$types";

	export let data: PageData;
	let councilor_list = data.councilors!;

	let member_count = 1;
</script>

<div class="flex h-full w-full items-center justify-center p-4">
	<div class="w-full max-w-4xl">
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
							<option value={councilor.id}>{councilor.name}</option>
						{/each}
					</select>
				</label>
				<label>
					{$t("member")}
					{#each Array(member_count) as _, i}
						<select name="member" class="select mb-4 w-full">
							<option disabled selected />
							{#each councilor_list as councilor}
								<option value={councilor.id}>{councilor.name}</option>
							{/each}
						</select>
					{/each}
					<button type="button" class="btn-primary btn" on:click={() => member_count++}>
						{$t("add")}
					</button>
				</label>
				<button class="btn-primary btn">{$t("create")}</button>
			</form>
			<div class="prose max-w-sm">
				<Markdown source={$t("create-new-committee.description")} />
			</div>
		</div>
	</div>
</div>
