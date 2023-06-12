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
			<input name="base_model" type="text" />
		</label>
		<label>
			Trait
			<input name="trait" type="text" />
		</label>
		<button>Save</button>
	</form>
	<form method="POST" action="?/clone">
		<label>
			Namespace
			<input name="namespace" type="text" />
		</label>
		<button>Clone</button>
	</form>
</div>
