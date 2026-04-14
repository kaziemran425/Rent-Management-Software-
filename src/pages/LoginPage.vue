<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="login-card shadow-10">
      <q-card-section class="q-pa-xl">
        <div class="text-center">
          <div class="text-h4 text-bold text-indigo-9">Welcome</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">Login with your credentials</div>
        </div>

        <div class="q-mt-xl q-gutter-y-md">
          <q-input
            v-model="username"
            label="Username"
            outlined
            dense
            color="indigo-9"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            :type="isPassword ? 'password' : 'text'"
            outlined
            dense
            color="indigo-9"
            @keyup.enter="handleLogin"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPassword = !isPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="text-right q-mt-sm">
          <q-btn
            flat
            no-caps
            label="Forgot Password?"
            color="indigo-9"
            size="sm"
            to="/forgot-password"
          />
        </div>

        <div class="q-mt-lg">
          <q-btn
            label="Login"
            color="indigo-9"
            class="full-width text-bold"
            unelevated
            size="lg"
            :loading="loading"
            @click="handleLogin"
          />
        </div>

        <div class="row items-center q-mt-lg">
          <q-separator col />
          <div class="q-px-sm text-caption text-grey text-bold">OR LOGIN WITH</div>
          <q-separator col />
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col">
            <q-btn outline color="grey-4" class="full-width">
              <q-img src="~assets/social-assets/google-logo.png" style="width: 20px; height: 20px" fit="contain" />
            </q-btn>
          </div>
          <div class="col">
            <q-btn outline color="grey-4" class="full-width">
              <q-img src="~assets/social-assets/facebook.jpg" style="width: 20px; height: 20px" fit="contain" />
            </q-btn>
          </div>
          <div class="col">
            <q-btn outline color="grey-4" class="full-width">
              <q-img src="~assets/social-assets/apple-logo.jpeg" style="width: 20px; height: 20px" fit="contain" />
            </q-btn>
          </div>
        </div>

        <div class="text-center q-mt-xl text-grey-8">
          Don't have an account? 
          <q-btn flat no-caps label="Sign Up" color="indigo-9" class="q-px-none text-bold" to="/register" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// Reactive State
const username = ref('')
const password = ref('')
const isPassword = ref(true)
const loading = ref(false)

/**
 * Standardized Notification Template
 * @param {string} type - 'positive' or 'negative'
 * @param {string} msg - The message text
 */
const triggerNotify = (type, msg) => {
  $q.notify({
    type: type, // Quasar handles color/icon automatically for 'positive', 'negative', 'warning', 'info'
    message: msg,
    position: 'top',
    timeout: 2500,
    actions: [{ icon: 'close', color: 'white', round: true }]
  })
}

const handleLogin = () => {
  // 1. Validate inputs
  if (!username.value || !password.value) {
    triggerNotify('negative', 'Username and Password are required')
    return
  }

  // 2. Start Loading State
  loading.value = true
  
  // 3. Simulated API Call (Desktop login logic)
  setTimeout(() => {
    loading.value = false
    
    // Replace with your real auth logic
    const success = true 

    if (success) {
      triggerNotify('positive', 'Successfully logged in. Welcome back!')
      router.push('/Admin/Dashboard')
    } else {
      triggerNotify('negative', 'Invalid credentials. Please try again.')
    }
  }, 1500)
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  /* Adding a subtle border for desktop clarity */
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>