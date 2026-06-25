<script lang="ts">
	import Button, { Type, Variant } from './Button.svelte';

	// Controlled multi-select tag filter, reused by the Knowledge list and the global /tags page.
	// The parent owns the selection state; this component only renders the toggles and reports clicks.
	//   tags     — every tag the user can pick from (may be empty)
	//   selected — the tags currently active
	//   onToggle — turn a single tag on/off
	//   onClear  — clear the whole selection
	let {
		tags,
		selected,
		onToggle,
		onClear
	}: {
		tags: string[];
		selected: string[];
		onToggle: (tag: string) => void;
		onClear: () => void;
	} = $props();
</script>

<!-- Nothing to filter by until there are tags, so render nothing then. -->
{#if tags.length > 0}
	<div class="TagFilter">
		{#each tags as tag (tag)}
			{@const isSelected = selected.includes(tag)}
			<!-- Selected tags are a filled blue; unselected are outlined. Both keep white text on a
			     dark/transparent background so the label stays legible. -->
			<Button
				label={tag}
				type={isSelected ? Type.FILL : Type.OUTLINE}
				variant={isSelected ? Variant.PRIMARY : Variant.NEUTRAL}
				on:click={() => onToggle(tag)}
			/>
		{/each}
		{#if selected.length > 0}
			<Button label="Clear" type={Type.NONE} on:click={onClear} />
		{/if}
	</div>
{/if}

<style>
	.TagFilter {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		margin-bottom: 1.5em;
	}
</style>
