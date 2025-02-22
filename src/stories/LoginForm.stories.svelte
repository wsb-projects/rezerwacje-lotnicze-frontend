<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import LoginForm from '@components/LoginForm.svelte';
	import { fn } from '@storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Login Form',
		component: LoginForm,
		tags: ['autodocs']
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" />
