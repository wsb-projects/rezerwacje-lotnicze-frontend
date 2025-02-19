<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import LoginForm from '../components/LoginForm.svelte';
	import ThemeChooser from '../components/ThemeChooser.svelte';
	import SvelteLogo from 'virtual:icons/logos/svelte-icon';
	let { children } = $props();

	var login_form = $state<HTMLDialogElement>();

	function login(email: string, password: string) {
		login_form?.close();
		console.log('Logging in:', email, password);
		auth.login(email, password);
	}

	async function register(email: string, password: string) {
		login_form?.close();
		console.log('Registering:', email, password);
		await auth.register(email, password);
		auth.login(email, password);
	}
</script>

<div class="navbar bg-base-100 sticky top-0 z-50 mb-3 shadow-sm">
	<div class="avatar mx-3">
		<SvelteLogo />
	</div>
	<nav class="join flex-1">
		<a href="/" class={[{ 'join-item': auth.isAuthed() }, 'btn', 'btn-outline']}>Flights</a>
		<a href="/tickets" class={['join-item', 'btn', 'btn-outline', { hidden: !auth.isAuthed() }]}
			>Tickets</a
		>
	</nav>
	<div>
		{#if auth.isAuthed()}
			<div class="join">
				<div class="join-item input input-bordered flex items-center">user@example.com</div>
				<a href="/" class="btn join-item btn-outline btn-error" onclick={() => auth.reset()}
					>Logout</a
				>
			</div>
		{:else}
			<button class="btn btn-outline" onclick={() => login_form?.showModal()}>Login</button>
			<LoginForm bind:dialog={login_form} {login} {register} />
		{/if}
		<ThemeChooser />
	</div>
</div>

<div class="mx-auto h-fit min-h-full max-w-2xl border-x border-(--color-neutral) p-10">
	{@render children()}
</div>
