<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import Toast, { toast } from 'svelte-daisy-toast';
	import LoginForm from '@components/LoginForm.svelte';
	import ThemeChooser from '@components/ThemeChooser.svelte';
	import SvelteLogo from 'virtual:icons/logos/svelte-icon';
	import { isAuthBad, isRegisterBad } from '$lib/foreign/api.svelte';
	import { page } from '$app/state';
	let { children } = $props();

	var login_form = $state<HTMLDialogElement>();

	async function login(email: string, password: string) {
		login_form?.close();
		const resp = await auth.login(email, password);
		if (isAuthBad(resp)) {
			toast({ type: 'error', message: 'Failed to login: ' + resp.detail });
		} else {
			toast({ type: 'success', message: 'Logged in successfully' });
		}
	}

	async function register(email: string, password: string) {
		login_form?.close();
		console.log('Registering:', email, password);
		const resp = await auth.register(email, password);
		if (isRegisterBad(resp)) {
			for (const err in resp.errors) {
				toast({ type: 'error', message: err });
			}
		} else {
			toast({ type: 'success', message: 'Registered successfully' });
			await login(email, password);
		}
	}

	const title = $derived(
		[...page.url.pathname.split('/').slice(1)]
			.filter(Boolean)
			.map((v: string) => v.charAt(0).toUpperCase() + v.slice(1))
			.join(' - ')
	);
</script>

<div class="navbar bg-base-100 sticky top-0 z-50 mb-3 grid grid-cols-3 shadow-sm">
	<div class="flex items-center justify-start">
		<div class="avatar mx-3">
			<SvelteLogo />
		</div>
		<nav class="join">
			<a href="/flights" class={[{ 'join-item': auth.isAuthed() }, 'btn', 'btn-outline']}>Flights</a
			>
			<a href="/tickets" class={['join-item', 'btn', 'btn-outline', { hidden: !auth.isAuthed() }]}
				>Tickets</a
			>
		</nav>
	</div>
	<h1 class="text-center text-2xl">{title}</h1>
	<div class="flex items-center justify-end">
		{#if auth.isAuthed()}
			<div class="join h-fit">
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

<div
	class="mx-auto h-fit min-h-full max-w-2xl border border-(--color-base-300) bg-(--color-base-100) p-10"
>
	{@render children()}
</div>
<Toast position="bottom-end" />
