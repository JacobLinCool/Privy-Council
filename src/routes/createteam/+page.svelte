<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center">
	<form method="POST" action="?/createteam">
		<label>
			Name
			<input name="name" type="text" />
		</label>
		<button>Create</button>
	</form>
</div>
