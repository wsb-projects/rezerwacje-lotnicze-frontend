<template>
  <div class="login-register">
    <form @submit.prevent="handleLogin">
      <div>
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" v-model="email" required />
      </div>
      <div>
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" v-model="password" required />
      </div>
      <div class="actions">
        <button type="submit">Login</button>
        <button type="button" id="register" @click="handleRegister">Register</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from '@/components/ui/toast'
import { isAuthBad, isRegisterBad } from '@/foreign/api'
import type { RegisterBad } from '@/foreign/types'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const email = ref('user@example.com')
const password = ref('Password123!')

const auth = useAuthStore()
const { toast } = useToast()

const handleLogin = () => {
  auth.reset()
  auth.login(email.value, password.value).then(a => {
    alert("Logging in")
    if (isAuthBad(a)) {
      toast({
        variant: 'destructive',
        title: a.title,
        description: a.detail,
      })
    } else {
      toast({
        title: 'Logged in',
        description: `You are now authorized as ${email}`,
      })
    }
  })
}

function combineMessages(reg: RegisterBad): string {
  return Object.values(reg.errors).flat().join('</br>')
}

const handleRegister = async () => {
  auth.api.register(email.value, password.value).then(r => {
    if (isRegisterBad(r)) {
      console.log(combineMessages(r))
      toast({
        variant: 'destructive',
        title: r.title,
        description: combineMessages(r),
      })
    } else {
      toast({
        title: 'Registered',
        description: `You can now log in as ${email}`,
      })
    }
  })
}
</script>

<style scoped>
.login-register {
  max-width: 300px;
}

.login-register form {
  margin-bottom: 1rem;
}

.login-register div {
  margin-bottom: 0.5rem;
}

.login-register label {
  display: block;
  margin-bottom: 0.25rem;
}

.login-register input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.login-register button {
  width: 100%;
  padding: 0.5rem;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.actions button {
  margin: 0 10px;
}
</style>
