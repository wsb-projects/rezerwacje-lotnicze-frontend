import { FlightsAPI, isAuthBad } from '@/foreign/api'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Auth } from '@/foreign/types'

export const useAuthStore = defineStore('auth', () => {
  const auth: Ref<FlightsAPI> = ref(new FlightsAPI('http://localhost:8080'))
  const _mail: Ref<string | null> = ref(null)
  const api = computed(() => auth.value)
  const mail = computed(() => _mail.value)
  function reset() {
    _mail.value = null
    auth.value.auth = null
  }
  const loggedIn = computed(() => auth.value.auth?.accessToken != undefined)
  function login(email: string, password: string): Promise<Auth> {
    return auth.value.login(email, password).then((a) => {
      if (!isAuthBad(a)) {
        _mail.value = email
        auth.value.auth = a
      }
      return a
    })
  }

  const backup = localStorage.getItem('pinia.auth')
  if (backup !== undefined) {
    const state = JSON.parse(localStorage.getItem('pinia.auth')!)
    if (state._mail !== undefined && state.auth !== undefined && state.auth.auth !== undefined) {
      _mail.value = state._mail
      auth.value.auth = state.auth.auth
    }
  }

  return {
    auth,
    _mail,
    api,
    mail,
    reset,
    loggedIn,
    login,
  }
})
