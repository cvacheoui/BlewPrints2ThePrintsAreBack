<script lang="ts">
	import Objects from '$lib/data';
	import Knowledge from '$lib/ui/Knowledge.svelte';
	import TagFilter from '$lib/ui/TagFilter.svelte';
	import Page from '$lib/ui/Page.svelte';

	// Tags the user has picked. An empty selection means "show everything".
	let selectedTags = $state<string[]>([]);

	// Every distinct content tag used across all knowledge entries, sorted so the bar is stable.
	const availableTags = $derived(
		[...new Set(Objects.know.table.flatMap((item) => [...item.contentTags]))].sort()
	);

	// An entry passes the filter if nothing is selected, or it carries at least one of the
	// selected tags (OR matching — selecting more tags shows more entries).
	const filtered = $derived(
		selectedTags.length === 0
			? Objects.know.table
			: Objects.know.table.filter((item) => selectedTags.some((tag) => item.contentTags.has(tag)))
	);

	// Reassign (rather than mutate in place) so the `$derived` values above recompute.
	function toggleTag(tag: string) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
	}

	function clearTags() {
		selectedTags = [];
	}
</script>

<Page>
	{#snippet title()}
		Knowledge items
	{/snippet}

	{#snippet content()}
		<div class="PageKnowledge">
			<TagFilter
				tags={availableTags}
				selected={selectedTags}
				onToggle={toggleTag}
				onClear={clearTags}
			/>
			<div class="list">
				{#each filtered as item (item.id)}
					<Knowledge instance={item} link hide />
				{/each}
			</div>
		</div>
	{/snippet}
</Page>

<style>
	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1em;
	}
</style>
