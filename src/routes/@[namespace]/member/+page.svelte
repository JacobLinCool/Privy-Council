<script lang="ts">
	import Model from "$lib/component/Model.svelte";
	import Icon from "@iconify/svelte";
	import type { PageData } from "./$types";
	import { t } from "svelte-i18n";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center p-4 py-20">
	<div class="prose h-full w-full overflow-auto">
		<h1>{data.team.name}</h1>
		<hr />

		<h2>Members</h2>
		<table class="table w-full">
			<thead>
				<tr>
					<th>User</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.team.memberships as member}
					<tr>
						<td>
							<span>{member.user.name}</span><br />
							<span class="text-sm opacity-60">{member.user.email}</span>
						</td>
						<td>{member.role}</td>
						<td class="flex gap-2">
							{#if member.role === "admin"}
								<Model>
									<button
										slot="opener"
										class="btn-info btn-outline btn-square btn"
									>
										<Icon icon="octicon:gear-16" />
									</button>

									<form
										slot="body"
										class="flex flex-col gap-4"
										method="POST"
										action="?/change-role"
									>
										<label class="label" for=""> Select Role </label>
										<select name="role" class="select w-full">
											<option value="member">Member</option>
											<option value="admin">Admin</option>
										</select>
										<input
											type="hidden"
											name="email"
											value={member.user.email}
										/>
										<button class="btn-success btn-outline btn">
											{$t("save")}
										</button>
									</form>
								</Model>

								<Model>
									<button
										slot="opener"
										class="btn-outline btn-error btn-square btn"
									>
										<Icon icon="octicon:x-16" />
									</button>

									<form
										slot="body"
										class="flex flex-col gap-4"
										method="POST"
										action="?/leave"
									>
										<label class="label" for="">
											Remove {member.user.name} from the team?
											{$t("delete-confirm")}
										</label>
										<input
											type="hidden"
											name="email"
											value={member.user.email}
										/>
										<button class="btn-outline btn-error btn">
											{$t("i-am-sure")}
										</button>
									</form>
								</Model>
							{:else if member.user.email === data.user?.email}
								<Model>
									<button
										slot="opener"
										class="btn-outline btn-error btn-square btn"
									>
										<Icon icon="octicon:x-16" />
									</button>

									<form
										slot="body"
										class="flex flex-col gap-4"
										method="POST"
										action="?/leave"
									>
										<label class="label" for="">
											Leave the team?
											{$t("delete-confirm")}
										</label>
										<input
											type="hidden"
											name="email"
											value={member.user.email}
										/>
										<button class="btn-outline btn-error btn">
											{$t("i-am-sure")}
										</button>
									</form>
								</Model>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if data.owned.includes(data.team.namespace_name)}
			<div class="divider" />
			<h2>Invite</h2>
			<form method="POST" class="flex flex-col gap-4" action="?/add-member">
				<input class="input" name="email" placeholder="Email" type="text" />
				<button class="btn-success btn-outline btn">Invite</button>
			</form>

			{#if data.team.logs}
				<div class="divider" />
				<h2>Team Log</h2>
				<table class="table w-full">
					<thead>
						<tr>
							<th>Time</th>
							<th>User</th>
							<th>Details</th>
						</tr>
					</thead>
					<tbody>
						{#each data.team.logs as log}
							<tr>
								<td>{log.time.toLocaleString()}</td>
								<td>{log.user?.name}</td>
								<td>{log.content}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}

			<div class="divider" />
			<h2>Delete Team</h2>
			<Model>
				<button slot="opener" class="btn-outline btn-error btn w-full">
					Delete Team
					<Icon icon="octicon:trash-16" class="ml-1 inline-block" />
				</button>

				<form slot="body" class="flex flex-col gap-4" method="POST" action="?/delete-team">
					<label class="label" for="">
						Delete the WHOLE team?
						{$t("delete-confirm")}
					</label>
					<button class="btn-outline btn-error btn">
						{$t("i-am-sure")}
					</button>
				</form>
			</Model>
		{/if}
	</div>

	<!-- <form method="POST" action="?/leave">
		<label>
			Email
			<input name="email" type="text" />
		</label>
		<button>Leave</button>
	</form>
	<form method="POST" action="?/add-member">
		<label>
			Email
			<input name="email" type="text" />
		</label>
		<button>Add Member</button>
	</form>
	<form method="POST" action="?/change-role">
		<label>
			Email
			<input name="email" type="text" />
		</label>
		<label>
			Role
			<input name="role" type="text" />
		</label>
		<button>Change Role</button>
	</form>
	<form method="POST" action="?/delete-team">
		<button>Delete Team</button>
	</form> -->
</div>
