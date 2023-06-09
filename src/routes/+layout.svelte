<script lang="ts">
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";
	import "../app.css";
	import PageTransition from "$lib/component/PageTransition.svelte";
</script>

<div class="group fixed left-0 top-0 z-20 w-full p-2">
	<nav class="navbar -top-8 rounded-lg bg-base-100 shadow-lg transition-all group-hover:top-0">
		<div class="top-3 flex-1 transition-all group-hover:top-0">
			<a class="btn-ghost btn text-xl normal-case" href="/"> Privy Council </a>
		</div>
		<div class="top-3 flex-none transition-all group-hover:top-0">
			<ul class="menu menu-horizontal px-1">
				<li>
					<a href="/home">
						<Icon icon="octicon:apps-16" inline />
						<span class="hidden sm:inline-block">{$t("nav.home")}</span>
					</a>
				</li>
				<li>
					<a href="/trending">
						<Icon icon="octicon:git-commit-16" inline />
						<span class="hidden sm:inline-block">{$t("nav.trending")}</span>
					</a>
				</li>
			</ul>
		</div>
	</nav>
</div>

<PageTransition>
	<slot />
</PageTransition>
