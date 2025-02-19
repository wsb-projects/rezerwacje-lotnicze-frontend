import { FlightsAPI } from './foreign/api.svelte';

export const auth = $state(new FlightsAPI('http://localhost:8080'));
