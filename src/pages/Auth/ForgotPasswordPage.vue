<template>
  <q-page class="flex flex-center bg-grey-2 padding">
    <q-card class="auth-card shadow-4" bordered>

      <q-card-section class="text-center q-pb-none">
        <q-avatar size="72px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="App Logo">
        </q-avatar>
        <div class="text-h5 text-weight-bold q-mt-sm">Reset Password</div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Enter your email address and we'll send you a link to reset your password.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            outlined
            v-model="email"
            label="Email Address"
            type="email"
            lazy-rules
            :rules="[
              val => !!val || 'Email is required',
              val => isValidEmail(val) || 'Please enter a valid email address'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <div>
            <q-btn
              class="full-width q-mt-md"
              color="primary"
              label="Send Reset Link"
              type="submit"
              :loading="loading"
              unelevated
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pt-none">
        <q-btn
          flat
          color="grey-8"
          label="Back to Login"
          to="/auth/login"
          no-caps
          class="full-width"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const loading = ref(false)

// Simple email regex validation
const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(val)
}

const onSubmit = () => {
  loading.value = true

  // Simulate API call to send reset email
  setTimeout(() => {
    loading.value = false

    $q.notify({
      type: 'positive',
      message: 'Password reset link sent! Please check your inbox.',
      position: 'top-right'
    })

    // Clear input
    email.value = ''

    // Optionally redirect back to login
    router.push('/auth/login')
  }, 1500)
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}
</style>
