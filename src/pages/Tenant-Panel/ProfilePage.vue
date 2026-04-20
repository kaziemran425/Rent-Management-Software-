<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">My Profile</h4>
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="3em" /></div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders text-center q-pa-lg bg-white">
          <q-avatar size="100px" class="shadow-3 q-mb-md"><img src="https://cdn.quasar.dev/img/boy-avatar.png"></q-avatar>
          <div class="text-h5 text-weight-bold text-dark">{{ profile.name || 'Tenant Name' }}</div>
          <div class="text-subtitle2 text-primary q-mb-md">Assigned Unit: {{ profile.unit || 'N/A' }}</div>
          <q-badge color="positive" class="text-weight-bold">Account {{ profile.status || 'Active' }}</q-badge>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="shadow-1 rounded-borders bg-white">
          <q-card-section class="q-pa-lg">
            <q-form @submit.prevent="saveProfile" class="q-gutter-y-md">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-sm">Contact Information</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6"><q-input outlined dense v-model="profile.name" label="Full Name *" readonly bg-color="grey-2" hint="Contact Admin to change name" /></div>
                <div class="col-12 col-sm-6"><q-input outlined dense v-model="profile.email" label="Email Address *" readonly bg-color="grey-2" /></div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6"><q-input outlined dense v-model="profile.phone" label="Phone Number *" /></div>
                <div class="col-12 col-sm-6"><q-input outlined dense v-model="profile.emergencyPhone" label="Emergency Phone" /></div>
              </div>

              <div class="q-mt-xl text-right">
                <q-btn color="primary" type="submit" label="Save Profile Changes" unelevated class="text-weight-bold" :loading="isSaving" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)
const isSaving = ref(false)

const LOCAL_STORAGE_KEY = 'house_rent_tenants' // BRIDGE KEY
const profile = ref({})
const currentTenantEmail = 'tenant@iching.com' // Mocking logged in user's email

const fetchProfile = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    const allTenants = JSON.parse(saved)
    // Find the tenant matching the logged-in email (or just pick the first one for demo)
    const myData = allTenants.find(t => t.email === currentTenantEmail) || allTenants[0]
    if (myData) profile.value = { ...myData }
  }
  isLoading.value = false
}

onMounted(() => {
  fetchProfile()
  window.addEventListener('storage', fetchProfile) // Listen for Admin updates
})
onUnmounted(() => window.removeEventListener('storage', fetchProfile))

const saveProfile = () => {
  isSaving.value = true
  setTimeout(() => {
    let allTenants = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    const index = allTenants.findIndex(t => t.id === profile.value.id)

    if (index > -1) {
      allTenants[index] = { ...profile.value }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allTenants))
    }

    $q.notify({ type: 'positive', message: 'Profile updated successfully!' })
    isSaving.value = false
  }, 600)
}
</script>
