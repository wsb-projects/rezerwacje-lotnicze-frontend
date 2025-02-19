<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/ph/arrow-right';
	import TicketIcon from 'virtual:icons/ph/ticket';

	import type { Ticket } from '$lib/foreign/types';
	import DataCard from '@components/DataCard.svelte';
	import { isCargoTicket, isPassengerTicket } from '$lib/foreign/api.svelte';
	import { toast } from 'svelte-daisy-toast';

	var tickets: Ticket[] = $state([]);

	onMount(async () => {
		if (!auth.isAuthed()) {
			return;
		}
		const res = await auth.getTickets().catch(() => {
			toast({ message: 'Failed to fetch tickets', type: 'error' });
			return [];
		});
		tickets = res;
	});

	function ticketExtractor(ticket: Ticket): { key: string; value: any }[] {
		const data: { key: string; value: any }[] = [
			{ key: 'departure', value: ticket.flight.departureLocation },
			{ key: 'arrival', value: ticket.flight.arrivalLocation },
			{ key: 'departure time', value: new Date(ticket.flight.departureDate).toLocaleString() },
			{ key: 'arrival time', value: new Date(ticket.flight.arrivalDate).toLocaleString() }
		];

		if (isPassengerTicket(ticket)) {
			data.push({ key: 'Seats', value: ticket.numberOfSeats });
		} else if (isCargoTicket(ticket)) {
			data.push(
				{ key: 'Volume', value: ticket.cargoVolume },
				{ key: 'Weight', value: ticket.cargoWeight }
			);
		}

		return data;
	}
</script>

<div class="flex flex-col gap-y-5">
	<h1 class="mx-auto text-2xl">Tickets</h1>
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div class="divider" />
	{#each tickets as flight}
		<DataCard data={flight} extractor={ticketExtractor}>
			{#snippet header(ticket: Ticket)}
				<h1 class="card-title justify-center">
					<TicketIcon />
					{ticket.flight.departureLocation}
					<ArrowRight />
					{ticket.flight.arrivalLocation}
				</h1>
			{/snippet}
		</DataCard>
	{/each}
</div>
