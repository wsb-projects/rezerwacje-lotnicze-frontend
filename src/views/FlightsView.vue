<script setup lang="ts">
import Flight from '@/components/Flight.vue'
import type { Flight as FlightT } from '@/foreign/types'
import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'

const auth = useAuthStore()

const flights: Ref<FlightT[]> = ref([])
auth.api.getFlights().then((data) => (flights.value = data))

function type(type: number): String {
  return type === 0 ? 'P' : 'C'
}

function buy(flight: any) {
  // const ticket: TicketRequest = {
  //     flightId: flight.id,
  //     ticketType: flight.flightType == 0 ? 'passenger' : 'cargo',
  //     seats: 1,
  //     volume: 1,
  //     weight: 1,
  // };
  // if (auth.auth?.accessToken != null) {
  //     buyTicket(auth.auth.accessToken, ticket);
  // } else {
  //     alert('You must be logged in to buy a ticket');
  // }
}
</script>

<template>
  <div class="flight-list" v-if="flights != null">
    <Flight class="flight" v-for="flight in flights" :flight="flight" />
  </div>
</template>

<style scoped>
.flight-list {
  margin: 10px 0;
  padding: 0;
}

.flight {
  margin-bottom: 20px;
}
</style>
