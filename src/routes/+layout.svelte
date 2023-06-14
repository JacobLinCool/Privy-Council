<script lang="ts">
	import PageTransition from "$lib/component/PageTransition.svelte";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";
	import "../app.css";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
</script>

<div class="group fixed left-0 top-0 z-20 w-full p-2">
	<nav class="navbar -top-8 rounded-lg bg-base-100 shadow-lg transition-all group-hover:top-0">
		<div class="top-3 flex-1 transition-all group-hover:top-0">
			<a class="btn-ghost btn text-xl normal-case" href="/"> Privy Council </a>
		</div>
		<div class="top-3 flex-none transition-all group-hover:top-0">
			<ul class="menu menu-horizontal px-1">
				<li>
					<a href="/trending">
						<Icon icon="octicon:git-commit-16" inline />
						<span class="hidden sm:inline-block">{$t("nav.trending")}</span>
					</a>
				</li>
				{#if data.user}
					<li>
						<a href="/@{data.user.namespace_name}/manage">
							<Icon icon="octicon:book-16" inline />
							<span class="hidden sm:inline-block">{$t("nav.manage")}</span>
						</a>
					</li>
					<li>
						<a href="/@{data.user.namespace_name}">
							<Icon icon="octicon:project-roadmap-16" inline />
							<span class="hidden sm:inline-block">{$t("nav.profile")}</span>
						</a>
					</li>
					<li>
						<a href="/auth/logout">
							<Icon icon="octicon:sign-out-16" inline />
							<span class="hidden sm:inline-block">{$t("nav.sign-out")}</span>
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</nav>
</div>

<PageTransition>
	<slot />
</PageTransition>
