<script setup lang="ts">
// import { getTickets, type Ticket } from '@/apiclient';
// import { useAuthStore } from '@/stores/token';
import type { Ticket as TicketT } from '@/foreign/types'
import Ticket from '@/components/Ticket.vue'
import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'

const auth = useAuthStore()
const tickets: Ref<TicketT[]> = ref([])

auth.api.getTickets().then((data) => (tickets.value = data))

function type(type: number): String {
  return type === 0 ? 'P' : 'C'
}
</script>

<template>
  <div class="tickets">
    <div class="ticket-list" v-if="tickets != null">
      <Ticket class="ticket" v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" />
    </div>
  </div>
</template>

<style scoped>
.ticket-list {
  margin: 10px 0;
  padding: 0;
}

.ticket {
  margin-bottom: 20px;
}
</style>
