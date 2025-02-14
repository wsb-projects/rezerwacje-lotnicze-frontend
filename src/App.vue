<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { routes } from './router/routes'
import { useAuthStore } from './stores/auth'
import { computed } from 'vue'
import { capitalize } from './utils'

import Theme from './components/ui/Theme.vue'
import { Toaster } from './components/ui/toast'

const auth = useAuthStore()

const router = useRouter()

const routeName = computed(() => {
  return capitalize(router.currentRoute.value.name?.toString())
})

const routesNav = computed(() => routes.filter((r) => r.auth === undefined || auth.loggedIn))
</script>

<template>
  <header class="sticky top-2 m-2 z-10">
    <Card class="p-2">
      <nav class="flex">
        <RouterLink v-for="route in routesNav" :to="route.path">
          <Button variant="link">{{ route.name }}</Button>
        </RouterLink>
        <div class="ml-auto flex space-x-3 items-center">
          <span v-if="auth.loggedIn">{{ auth.mail }} </span>
          <Button v-if="auth.loggedIn" variant="destructive" @click="auth.reset">Logout</Button>
          <Theme />
        </div>
      </nav>
    </Card>
  </header>
  <Card class="mb-10 mx-auto max-w-2xl">
    <CardHeader>
      <CardTitle>{{ routeName }}</CardTitle>
    </CardHeader>
    <CardContent>
      <RouterView />
    </CardContent>
  </Card>
  <Toaster />
</template>

<style scoped lang="postcss"></style>
