<script lang="ts">
	import { onMount } from 'svelte';

	const themes = ['wireframe', 'cyberpunk', 'retro', 'valentine', 'black', 'dracula', 'sky'].sort();

	var theme = $state('corporate');

	onMount(() => {
		const saved = localStorage.getItem('theme');
		if (saved) {
			theme = saved;
		}
	});
</script>

<div class="dropdown">
	<div tabindex="0" role="button" class="btn btn-outline m-1">
		Theme
		<svg
			width="12px"
			height="12px"
			class="inline-block h-2 w-2 fill-current opacity-60"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 2048 2048"
		>
			<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
		</svg>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content bg-base-300 rounded-box max-h-96 overflow-scroll p-2 shadow-2xl"
	>
		{#each themes as t (t)}
			<li>
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-sm btn-block btn-ghost w-full justify-start"
					aria-label={t}
					value={t}
					checked={t === theme}
					onchange={() => {
						theme = t;
						localStorage.setItem('theme', t);
					}}
				/>
			</li>
		{/each}
	</ul>
</div>
