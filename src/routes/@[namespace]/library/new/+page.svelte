<script lang="ts">
	import { t } from "svelte-i18n";
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="prose">
		<h1>{$t("create-new-library.title")}</h1>
		<form method="POST">
			<h2 style="padding-top:10%">
				{$t("name")}
				<input name="name" type="text" class="input w-full max-w-xs" />
			</h2>
			<button class="btn">{$t("create")}</button>
		</form>
		<p>{$t("create-new-library.description")}</p>
	</div>
</div>
