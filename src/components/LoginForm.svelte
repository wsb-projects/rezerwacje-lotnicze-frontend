<script lang="ts">
	let {
		dialog = $bindable(),
		login,
		register
	}: {
		dialog: HTMLDialogElement | undefined;
		login: (email: string, password: string) => void;
		register: (email: string, password: string) => void;
	} = $props();

	let email = $state('');
	let password = $state('');
</script>

<dialog bind:this={dialog} class="modal">
	<div class="login-box modal-box grid grid-cols-2 gap-3 text-right">
		<h1 class="col-span-2 w-full text-center text-xl">Login</h1>
		<label for="email_input">email:</label>
		<input
			id="email_input"
			class="validator px-1"
			bind:value={email}
			type="email"
			required
			placeholder="mail@site.com"
		/>
		<label for="pass_input">password:</label>
		<input
			id="pass_input"
			class="validator px-1"
			bind:value={password}
			type="password"
			required
			placeholder="password"
		/>
		<button class="btn btn-outline" onclick={() => login(email, password)}>Login</button>
		<button class="btn btn-outline" onclick={() => register(email, password)}>Register</button>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
