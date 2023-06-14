<script lang="ts">
	import type { PageData } from "./$types";
	import { t } from "svelte-i18n";
	export let data: PageData;

	let pencil_mode = false;
	function pencil() {
		pencil_mode = !pencil_mode;
	}
	const is_personal = data.namespace.user == null ? false : true;
	const is_team = data.namespace.team == null ? false : true;
</script>

<div class="flex h-full w-full justify-center overflow-auto" style="padding-top:10%">
	<div class="prose">
		<div style="width:100%;word-wrap:break-word">
			{#if is_personal}
				<h5>Personal</h5>
			{:else if is_team}
				<h5>Team</h5>
			{/if}
			{#if pencil_mode}
				<form method="POST">
					<input
						type="text"
						name="name"
						class="input-bordered input input-lg w-full max-w-xs"
						value={data.namespace.user?.name || data.namespace.team?.name}
					/>
					<textarea
						class="textarea"
						name="bio"
						style="width:150%;height:150%;overflow-x:visible;overflow-y:visible;"
						value={data.namespace.user?.bio || data.namespace.team?.bio}
					/>
					<button class="btn">Save</button>
				</form>
			{:else}
				<h1>{data.namespace.user?.name || data.namespace.team?.name}</h1>
				<p>{data.namespace.user?.bio || data.namespace.team?.bio}</p>
				<button on:click={pencil} class="btn">Pencil here</button>
			{/if}
		</div>
		<div>
			<h2>
				{$t("councilor")}
			</h2>

			<hr />
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Update</th>
						</tr>
					</thead>
					{#each data.namespace.councilors as councilor}
						<tbody>
							<tr class="hover">
								<td>{councilor.name}</td>
								<td>{councilor.updated}</td>
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		</div>
		<div>
			<h2>
				{$t("committee")}
			</h2>

			<hr />
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Update</th>
						</tr>
					</thead>
					{#each data.namespace.committees as committee}
						<tbody>
							<tr class="hover">
								<td>{committee.name}</td>
								<td>{committee.updated}</td>
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		</div>
		<div>
			<h2>
				{$t("conversation")}
			</h2>
			<hr />
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Update</th>
						</tr>
					</thead>
					{#each data.namespace.conversations as conversation}
						<tbody>
							<tr class="hover">
								<td>{conversation.namespace_name}</td>
								<td>{conversation.updated}</td>
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		</div>
		<div>
			<h2>
				{$t("library")}
			</h2>
			<hr />
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Update</th>
						</tr>
					</thead>
					{#each data.namespace.libraries as library}
						<tbody>
							<tr class="hover">
								<td>{library.name}</td>
								<td>{library.updated}</td>
							</tr>
						</tbody>
					{/each}
				</table>
			</div>
		</div>
		{#if is_personal}
			<div>
				<h2>
					{$t("team")}
				</h2>
				<hr />
			</div>
		{:else if is_team}
			<div>
				<h2>
					{$t("member")}
				</h2>
				<hr />
			</div>
		{/if}
	</div>
</div>
