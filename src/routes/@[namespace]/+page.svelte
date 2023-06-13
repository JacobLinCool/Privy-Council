<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center">
	<form method="POST">
		<label>
			Name
			<input name="name" type="text" />
		</label>
		<label>
			Bio
			<input name="bio" type="text" />
		</label>
		<button>Pencil Here</button>
	</form>
</div>
