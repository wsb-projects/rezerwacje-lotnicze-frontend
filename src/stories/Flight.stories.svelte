<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Flight from '@components/DataCard.svelte';
	import { fn } from '@storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Flight',
		component: Flight,
		tags: ['autodocs'],
		args: {
			data: {
				airline: 'Delta',
				flight: 'DL123'
			}
		}
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" />
