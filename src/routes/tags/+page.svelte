<script lang="ts">
	import type { Component } from 'svelte';
	import Objects from '$lib/data';
	import Page from '$lib/ui/Page.svelte';
	import TagFilter from '$lib/ui/TagFilter.svelte';
	import Knowledge from '$lib/ui/Knowledge.svelte';

	// A taggable category: its entries (anything with an `id` and a Set of content tags) and the
	// card component used to render a match. To include another content type, add one entry here
	// once its loader exposes a string `contentTags` getter (e.g. items, rooms, books) — the filter
	// bar and the grouped results both pick it up automatically.
	interface TagCategory {
		label: string;
		items: () => { id: string; contentTags: Set<string> }[];
		Card: Component<any>;
		cardProps?: Record<string, unknown>;
	}

	const categories: TagCategory[] = [
		{
			label: 'Knowledge',
			items: () => Objects.know.table,
			Card: Knowledge,
			cardProps: { hide: true }
		}
	];

	// Tags the user has picked. OR matching: an entry shows if it carries any selected tag.
	let selectedTags = $state<string[]>([]);

	// Every distinct content tag across all categories, sorted so the filter bar is stable.
	const availableTags = $derived(
		[
			...new Set(categories.flatMap((c) => c.items().flatMap((entry) => [...entry.contentTags])))
		].sort()
	);

	// Matches per category for the current selection. Empty until at least one tag is chosen, and
	// categories with no matches are dropped so only relevant groups render.
	const groups = $derived(
		selectedTags.length === 0
			? []
			: categories
					.map((c) => ({
						label: c.label,
						Card: c.Card,
						cardProps: c.cardProps ?? {},
						matches: c.items().filter((entry) => selectedTags.some((t) => entry.contentTags.has(t)))
					}))
					.filter((group) => group.matches.length > 0)
	);

	// Reassign (rather than mutate) so the `$derived` values recompute.
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
		Content Tags
	{/snippet}

	{#snippet content()}
		<div class="PageTags">
			<TagFilter
				tags={availableTags}
				selected={selectedTags}
				onToggle={toggleTag}
				onClear={clearTags}
			/>

			{#if availableTags.length === 0}
				<p class="hint">
					No content tags yet. Add a "Content Tags" value to entries in the sheet, then re-fetch.
				</p>
			{:else if selectedTags.length === 0}
				<p class="hint">
					Pick one or more content tags above to see everything tagged with them, grouped by
					category.
				</p>
			{:else}
				{#each groups as group (group.label)}
					{@const Card = group.Card}
					<section class="group">
						<h3>{group.label} <span class="count">{group.matches.length}</span></h3>
						<div class="list">
							{#each group.matches as entry (group.label + ':' + entry.id)}
								<Card instance={entry} link {...group.cardProps} />
							{/each}
						</div>
					</section>
				{/each}
			{/if}
		</div>
	{/snippet}
</Page>

<style>
	.hint {
		color: rgba(255, 252, 240, 0.5);
	}
	.group {
		margin-bottom: 2em;
	}
	.group h3 {
		margin-bottom: 0.75em;
	}
	.count {
		opacity: 0.5;
		font-size: 0.8em;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1em;
	}
</style>
