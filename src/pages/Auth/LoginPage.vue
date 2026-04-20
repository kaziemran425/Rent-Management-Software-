<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="shadow-4 login-card rounded-borders">
      <div class="row">
        <div class="col-12 col-md-5 bg-primary text-white flex flex-center q-pa-xl text-center">
          <div>
            <q-icon name="apartment" size="80px" class="q-mb-md" />
            <div class="text-h4 text-weight-bolder tracking-tight">Iching Residences</div>
            <div class="text-subtitle1 q-mt-sm opacity-80">Smart Property Management</div>
          </div>
        </div>

        <div class="col-12 col-md-7 q-pa-xl bg-white">
          <div class="text-h5 text-weight-bold text-dark q-mb-xs">Welcome Back</div>
          <div class="text-grey-7 q-mb-xl">Please sign in to your account</div>

          <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
            <q-input
              outlined
              v-model="credentials.email"
              label="Email Address"
              type="email"
              :rules="[val => !!val || 'Email is required']"
            >
              <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
            </q-input>

            <q-input
              outlined
              v-model="credentials.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :rules="[val => !!val || 'Password is required']"
            >
              <template v-slot:prepend><q-icon name="lock" color="grey-6" /></template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <div class="row justify-between items-center q-mt-sm">
              <q-checkbox v-model="rememberMe" label="Remember me" color="primary" />
              <q-btn flat color="primary" label="Forgot Password?" to="/auth/forgot-password" class="text-capitalize" />
            </div>

            <q-btn
              type="submit"
              color="primary"
              class="full-width q-mt-lg text-weight-bold"
              size="lg"
              label="Sign In"
              unelevated
              :loading="isLoading"
            />
          </q-form>

          <div class="q-mt-xl q-pa-md bg-blue-1 rounded-borders text-caption text-grey-8">
            <strong>Testing Accounts:</strong><br>
            Admin: <code>admin@iching.com</code><br>
            Tenant: <code>tenant@iching.com</code>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const isLoading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const credentials = reactive({
  email: '',
  password: 'password123' // Dummy password
})

const handleLogin = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace with axios.post('/api/auth/login')
  setTimeout(() => {
    let role = ''
    let redirectRoute = ''

    // Mock RBAC (Role-Based Access Control) Logic
    if (credentials.email.toLowerCase() === 'admin@iching.com') {
      role = 'admin'
      redirectRoute = '/admin/dashboard'
    } else if (credentials.email.toLowerCase() === 'tenant@iching.com') {
      role = 'tenant'
      redirectRoute = '/tenant/dashboard'
    } else {
      $q.notify({ type: 'negative', message: 'Invalid credentials. Try admin@iching.com or tenant@iching.com' })
      isLoading.value = false
      return
    }

    // Save Session to Local Storage
    const userSession = {
      email: credentials.email,
      role: role,
      token: 'mock-jwt-token-12345'
    }
    localStorage.setItem('iching_user_session', JSON.stringify(userSession))

    $q.notify({ type: 'positive', message: `Successfully logged in as ${role.toUpperCase()}`, position: 'top-right' })

    isLoading.value = false
    router.push(redirectRoute)

  }, 1000)
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 900px;
  overflow: hidden;
}
.tracking-tight { letter-spacing: -0.03em; }
.opacity-80 { opacity: 0.8; }
</style>
