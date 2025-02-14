<script setup lang="ts">
import {
  date,
  isCargoTicket,
  isPassengerTicket,
} from '@/foreign/api'
import { type Flight, type Ticket, type TicketReq } from '@/foreign/types'
import { useAuthStore } from '@/stores/auth'
import { Badge } from './ui/badge'
import {
  CardTitle,
} from '@/components/ui/card'
import DataCard from './DataCard.vue'

import { Ticket as TicketIcon, MoveRight } from 'lucide-vue-next'

defineProps<{
  ticket: Ticket
}>()

const auth = useAuthStore()

function fields(ticket: Ticket): { name: string; value: string }[] {
  const fields = [
    { name: 'Departure', value: date(ticket.flight.departureDate) },
    { name: 'Arrival', value: date(ticket.flight.arrivalDate) },
  ]

  if (isPassengerTicket(ticket)) {
    fields.push({ name: 'Seats', value: ticket.numberOfSeats.toString() })
  } else if (isCargoTicket(ticket)) {
    fields.push({ name: 'Volume Capacity', value: ticket.cargoVolume.toString() })
    fields.push({ name: 'Weight Capacity', value: ticket.cargoWeight.toString() })
  }

  return fields
}
</script>

<template>
  <DataCard :fields="fields(ticket)">
    <template #header>
      <CardTitle class="flex justify-between text-center text-lg">
        <div class="flex items-center space-x-2">
          <TicketIcon />
          <span> {{ ticket.flight.departureLocation }} </span>
          <MoveRight />
          <span> {{ ticket.flight.arrivalLocation }} </span>
        </div>
        <div class="flex space-x-2">
          <Badge variant="outline" v-if="isCargoTicket(ticket)">cargo</Badge>
          <Badge variant="outline" v-if="isPassengerTicket(ticket)">passenger</Badge>
        </div>
      </CardTitle>
    </template>
  </DataCard>
</template>

<style scoped></style>
