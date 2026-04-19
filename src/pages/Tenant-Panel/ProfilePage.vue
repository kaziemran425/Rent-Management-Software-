<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">My Profile</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage your personal information and contact details</div>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-lg">

      <div class="col-12 col-md-4 col-lg-3">
        <q-card flat bordered class="shadow-1 rounded-borders text-center q-pa-lg bg-white">
          <div class="relative-position inline-block q-mb-md">
            <q-avatar size="120px" class="shadow-3">
              <img :src="profile.avatar || 'https://cdn.quasar.dev/img/boy-avatar.png'" style="object-fit: cover;">
            </q-avatar>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handlePhotoUpload"
            />
            <q-btn
              round
              color="primary"
              icon="photo_camera"
              size="sm"
              class="absolute-bottom-right"
              style="bottom: 0px; right: 0px;"
              @click="triggerUpload"
            >
              <q-tooltip>Update Photo</q-tooltip>
            </q-btn>
          </div>

          <div class="text-h5 text-weight-bold text-dark q-mt-sm">{{ profile.firstName }} {{ profile.lastName }}</div>
          <div class="text-subtitle2 text-primary text-weight-medium q-mb-md">Tenant</div>

          <q-badge color="positive" class="q-pa-xs q-px-sm text-weight-bold q-mb-md" rounded>Account Active</q-badge>

          <q-separator class="q-my-md" />

          <q-list dense class="text-left">
            <q-item class="q-px-none">
              <q-item-section avatar min-width="30px"><q-icon name="meeting_room" color="grey-6" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Assigned Unit</q-item-label>
                <q-item-label class="text-weight-bold text-dark">{{ profile.assignedUnit }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-px-none">
              <q-item-section avatar min-width="30px"><q-icon name="event" color="grey-6" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Lease Started</q-item-label>
                <q-item-label class="text-weight-bold text-dark">{{ profile.leaseStart }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-8 col-lg-9">
        <q-card flat bordered class="shadow-1 rounded-borders bg-white">
          <q-card-section class="q-pa-lg">

            <q-form @submit.prevent="saveProfile" class="q-gutter-y-md">

              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-md">Personal Information</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.firstName"
                    label="First Name *"
                    :rules="[val => !!val || 'First name is required']"
                  >
                    <template v-slot:prepend><q-icon name="person" color="grey-6" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.lastName"
                    label="Last Name *"
                    :rules="[val => !!val || 'Last name is required']"
                  >
                    <template v-slot:prepend><q-icon name="badge" color="grey-6" /></template>
                  </q-input>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.phone"
                    label="Phone Number *"
                    type="tel"
                    mask="###########"
                    :rules="[val => !!val || 'Phone number is required']"
                  >
                    <template v-slot:prepend><q-icon name="phone" color="grey-6" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.email"
                    label="Email Address"
                    type="email"
                    readonly
                    bg-color="grey-2"
                    hint="Contact management to change your email"
                  >
                    <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
                    <template v-slot:append><q-icon name="lock" color="grey-5" size="xs" /></template>
                  </q-input>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-md">Emergency Contact</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.emergencyName"
                    label="Contact Name"
                  >
                    <template v-slot:prepend><q-icon name="health_and_safety" color="grey-6" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    v-model="profile.emergencyPhone"
                    label="Contact Phone Number"
                    type="tel"
                    mask="###########"
                  >
                    <template v-slot:prepend><q-icon name="contact_phone" color="grey-6" /></template>
                  </q-input>
                </div>
              </div>

              <div class="q-mt-xl text-right">
                <q-btn
                  color="primary"
                  type="submit"
                  label="Save Profile Changes"
                  icon-right="save"
                  unelevated
                  class="text-weight-bold"
                  padding="10px 24px"
                  :loading="isSaving"
                />
              </div>

            </q-form>

          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- State Variables ---
const isLoading = ref(true)
const isSaving = ref(false)
const fileInput = ref(null)

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  emergencyName: '',
  emergencyPhone: '',
  avatar: '',
  assignedUnit: '', // Read-only data from backend
  leaseStart: ''    // Read-only data from backend
})

const LOCAL_STORAGE_KEY = 'tenant_personal_profile'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchProfile()
})

const fetchProfile = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenant/profile')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      profile.value = JSON.parse(savedData)
    } else {
      // Default Mock Data from your backend
      profile.value = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '01711223344',
        emergencyName: 'Jane Doe',
        emergencyPhone: '01811223344',
        avatar: '', // Base64 or URL
        assignedUnit: 'Apt 4B - Building North',
        leaseStart: 'May 1, 2025'
      }
    }
    isLoading.value = false
  }, 600) // Simulated network delay
}

// --- Methods ---

// Image Upload Handling (Converts to Base64 to save locally)
const triggerUpload = () => {
  fileInput.value.click()
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      $q.notify({ type: 'negative', message: 'Image must be less than 2MB', position: 'top-right' })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target.result // Update UI instantly

      // Auto-save just the avatar update
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile.value))

      // INTEGRATION POINT: axios.post('/api/tenant/profile/avatar', formData)
      $q.notify({ type: 'positive', message: 'Profile photo updated.', position: 'top-right' })
    }
    reader.readAsDataURL(file)
  }
}

// Form Submission
const saveProfile = () => {
  isSaving.value = true

  // INTEGRATION POINT: axios.put('/api/tenant/profile', profile.value)

  setTimeout(() => {
    // Save locally to persist on refresh
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile.value))

    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully.',
      position: 'top-right',
      icon: 'check_circle'
    })

    isSaving.value = false
  }, 800) // Simulated API delay
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
</style>
