<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center">
	<form method="POST" action="?/delete">
		<button>Delete</button>
	</form>
	<form method="POST" action="?/save">
		<label>
			Name
			<input name="name" type="text" />
		</label>
		<label>
			Base Model
			<input name="baseModel" type="text" />
		</label>
		<label>
			Trait
			<input name="trait" type="text" />
		</label>
		<button>Save</button>
	</form>
</div>
