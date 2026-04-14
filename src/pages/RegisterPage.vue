<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="register-card shadow-10">
      <q-card-section class="q-pa-xl">
        <div class="text-center">
          <div class="text-h4 text-bold text-indigo-9">Create Account</div>
          <div class="text-subtitle2 text-grey-7 q-mt-sm">Join our Rent Management system</div>
        </div>

        <div class="q-mt-xl q-gutter-y-md">
          <q-input
            v-model="form.fullName"
            label="Full Name"
            outlined
            dense
            color="indigo-9"
          >
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>

          <q-input
            v-model="form.phone"
            label="Phone Number"
            type="tel"
            outlined
            dense
            color="indigo-9"
            mask="###########"
          >
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <q-input
            v-model="form.email"
            label="Email Address"
            type="email"
            outlined
            dense
            color="indigo-9"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Password"
            :type="isPassword ? 'password' : 'text'"
            outlined
            dense
            color="indigo-9"
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

          <q-input
            v-model="form.confirmPassword"
            label="Confirm Password"
            :type="isConfirmPassword ? 'password' : 'text'"
            outlined
            dense
            color="indigo-9"
          >
            <template v-slot:prepend>
              <q-icon name="lock_reset" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPassword = !isConfirmPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="q-mt-lg">
          <q-btn
            label="Register"
            color="indigo-9"
            class="full-width text-bold"
            unelevated
            size="lg"
            :loading="loading"
            @click="handleRegister"
          />
        </div>

        <div class="text-center q-mt-xl text-grey-8">
          Already have an account? 
          <q-btn flat no-caps label="Login here" color="indigo-9" class="q-px-none text-bold" to="/Login" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// UI State
const loading = ref(false)
const isPassword = ref(true)
const isConfirmPassword = ref(true)

// Form Data
const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

/**
 * Standardized Notification Template
 */
const triggerNotify = (type, msg) => {
  $q.notify({
    type: type,
    message: msg,
    position: 'top',
    timeout: 3000
  })
}

const handleRegister = () => {
  // 1. Validation including Phone
  if (!form.fullName || !form.phone || !form.email || !form.password) {
    triggerNotify('negative', 'All fields are required')
    return
  }

  // 2. Check phone length (example for 11 digits)
  if (form.phone.length < 11) {
    triggerNotify('negative', 'Please enter a valid 11-digit phone number')
    return
  }

  // 3. Check if passwords match
  if (form.password !== form.confirmPassword) {
    triggerNotify('negative', 'Passwords do not match')
    return
  }

  // 4. Start Loading
  loading.value = true

  // 5. Simulated API call
  setTimeout(() => {
    loading.value = false
    triggerNotify('positive', 'Account created! You can now login.')
    router.push('/Login')
  }, 2000)
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
}
</style>