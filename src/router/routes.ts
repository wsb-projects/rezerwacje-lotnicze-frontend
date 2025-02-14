import FlightsView from '@/views/FlightsView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TicketsView from '@/views/TicketsView.vue'

import { type RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/flights',
    name: 'flights',
    component: FlightsView,
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: TicketsView,
    auth: true,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
]
