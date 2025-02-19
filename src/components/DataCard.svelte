<script lang="ts" generics="T extends Record<string, any>">
	import type { Flight } from '$lib/foreign/types';
	import type { Snippet } from 'svelte';

	function objectKeys(obj: T): { key: string; value: any }[] {
		return Object.entries(obj).map(([key, value]) => ({ key, value: value as any }));
	}

	interface Props {
		extractor?: (obj: T) => { key: string; value: any }[];
		data: T;
		header?: Snippet<[T]>;
		actions?: Snippet<[T]>;
	}
	const { extractor = objectKeys, data, header, actions }: Props = $props();
</script>

<div class="card shadow">
	<div class="card-body">
		{#if header !== undefined}
			{@render header(data)}
		{/if}
		<table class="card-body table">
			<tbody>
				{#each extractor(data) as { key, value }}
					<tr>
						<td>{key}</td>
						<td>{value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if actions !== undefined}
			{@render actions(data)}
		{/if}
	</div>
</div>
