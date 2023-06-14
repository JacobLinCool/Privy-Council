<script lang="ts">
	const model_id = "model-" + Math.random().toString(36).substring(2, 8);
	let model: HTMLDialogElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => model.showModal()}>
	<slot name="opener" />
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={model}
	id={model_id}
	class="modal"
	on:click={(evt) => {
		if (evt.currentTarget === evt.target) {
			model.close();
		}
	}}
>
	<form method="dialog" class="modal-box">
		<slot name="body" />
	</form>
</dialog>
