<script setup lang="ts">
import { isCargoFlight, isPassengerFlight, date, toTicket } from '@/foreign/api'
import { type Flight, type TicketReq } from '@/foreign/types'
import { useAuthStore } from '@/stores/auth'
import {
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MoveRight, Plane } from 'lucide-vue-next'
import DataCard from './DataCard.vue'
import { computed } from 'vue'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const props = defineProps<{
  flight: Flight
}>()

const auth = useAuthStore()

function buy(flight: Flight) {
  const req: TicketReq = {
    flightId: flight.id,
    ticketType: toTicket(flight.flightType),
    seats: 1,
    volume: 1,
    weight: 1,
  }
  toast({
        title: 'Ticket bought',
        description: 'You can now view your ticket in the ticket section',
      })
  auth.api.buyTicket(req)
}

function fields(flight: Flight): { name: string; value: string }[] {
  const fields = [
    { name: 'Departure', value: date(flight.departureDate) },
    { name: 'Arrival', value: date(flight.arrivalDate) },
  ]

  if (isPassengerFlight(flight)) {
    fields.push({ name: 'Seats', value: flight.seatsCapacity.toString() })
    fields.push({ name: 'Price per seat', value: flight.seatPrice.toString() })
  } else if (isCargoFlight(flight)) {
    fields.push({ name: 'Volume Capacity', value: flight.cargoVolume.toString() })
    fields.push({ name: 'Weight Capacity', value: flight.cargoWeight.toString() })
  }

  return fields
}

const badges = computed(() => [
  { on: isCargoFlight(props.flight), text: 'cargo' },
  { on: isPassengerFlight(props.flight), text: 'passenger' },
])

</script>

<template>
  <DataCard :fields="fields(flight)">
    <template #header>
      <CardTitle class="flex justify-between text-center text-lg">
        <div class="flex items-center space-x-2">
          <Plane />
          <span>{{ flight.departureLocation }}</span>
          <MoveRight />
          <span>{{ flight.arrivalLocation }}</span>
        </div>
        <div class="flex space-x-2">
          <Badge variant="outline" v-if="isCargoFlight(flight)">cargo</Badge>
          <Badge variant="outline" v-if="isPassengerFlight(flight)">passenger</Badge>
        </div>
      </CardTitle>
    </template>
    <template #footer>
      <Button class="w-full" v-if="auth.loggedIn" @click="buy(flight)">Buy ticket</Button>
    </template>
  </DataCard>
</template>

<style scoped></style>
