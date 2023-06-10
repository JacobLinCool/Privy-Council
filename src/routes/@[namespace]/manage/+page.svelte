<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex h-full w-full items-center justify-center">
	<pre><code>{JSON.stringify(data.user, null, 4)}</code></pre>
</div>
