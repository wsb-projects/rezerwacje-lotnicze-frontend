<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import ArrowRight from 'virtual:icons/ph/arrow-right';
	import Plane from 'virtual:icons/ph/airplane-in-flight';

	import {
		TicketReqType,
		type Flight,
		type TicketReqCargo,
		type TicketReqPassenger
	} from '$lib/foreign/types';
	import DataCard from '@components/DataCard.svelte';
	import { isCargoFlight, isPassengerFlight, toTicket } from '$lib/foreign/api.svelte';
	import { toast } from 'svelte-daisy-toast';

	var flights: Flight[] = $state([]);

	onMount(async () => {
		const res = await auth.getFlights().catch(() => {
			toast({ message: 'Failed to fetch flights', type: 'error' });
			return [];
		});
		flights = res;
	});

	function flightExtractor(flight: Flight): { key: string; value: any }[] {
		const data: { key: string; value: any }[] = [
			{ key: 'departure', value: flight.departureLocation },
			{ key: 'arrival', value: flight.arrivalLocation },
			{ key: 'departure time', value: new Date(flight.departureDate).toLocaleString() },
			{ key: 'arrival time', value: new Date(flight.arrivalDate).toLocaleString() }
		];

		if (isCargoFlight(flight)) {
			data.push(
				{ key: 'Volume', value: flight.cargoVolume },
				{ key: 'Weight', value: flight.cargoWeight }
			);
		} else if (isPassengerFlight(flight)) {
			data.push(
				{ key: 'Seats', value: flight.seatsCapacity },
				{ key: 'Seat price', value: flight.seatPrice }
			);
		}

		return data;
	}

	function buyFlight(flight: Flight) {
		if (isCargoFlight(flight)) {
			const t: TicketReqCargo = {
				flightId: flight.id,
				volume: 100,
				weight: 100,
				ticketType: TicketReqType.Cargo
			};
			auth.buyTicket(t);
		} else {
			const t: TicketReqPassenger = {
				seats: 1,
				ticketType: TicketReqType.Passenger,
				flightId: flight.id
			};
			auth.buyTicket(t);
		}

		toast({
			message: 'Ticket bought!',
			type: 'success'
		});
	}
</script>

<div class="flex flex-col gap-y-5">
	<h1 class="mx-auto text-2xl">Flights</h1>
	<div class="divider" />
	{#each flights as flight}
		<DataCard data={flight} extractor={flightExtractor}>
			{#snippet header(flight: Flight)}
				<h1 class="card-title justify-center">
					<Plane />
					{flight.departureLocation}
					<ArrowRight />
					{flight.arrivalLocation}
				</h1>
			{/snippet}
			{#snippet actions(flight: Flight)}
				{#if auth.isAuthed()}
					<button class="btn btn-block" onclick={() => buyFlight(flight)}>Buy</button>
				{/if}
			{/snippet}
		</DataCard>
	{/each}
</div>
