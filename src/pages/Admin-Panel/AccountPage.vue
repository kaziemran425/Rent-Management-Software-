<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Account Settings</h4>
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="3em" /></div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders text-center q-pa-lg bg-white">
          <div class="relative-position inline-block q-mb-md">
            <q-avatar size="120px" class="shadow-3">
              <img :src="profile.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'" style="object-fit: cover;">
            </q-avatar>
            <input type="file" ref="fileInput" accept="image/*" style="display: none" @change="handlePhotoUpload" />
            <q-btn round color="primary" icon="photo_camera" size="sm" class="absolute-bottom-right" style="bottom: 0px; right: 0px;" @click="triggerUpload" />
          </div>
          <div class="text-h5 text-weight-bold text-dark q-mt-sm">{{ profile.name }}</div>
          <div class="text-subtitle2 text-primary text-weight-medium q-mb-md">System Administrator</div>
          <q-badge color="positive" class="q-pa-xs q-px-sm text-weight-bold" rounded>Super Admin</q-badge>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="shadow-1 rounded-borders bg-white">
          <q-card-section class="q-pa-lg">
            <q-form @submit.prevent="saveProfile" class="q-gutter-y-md">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-md">Personal Information</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input outlined dense v-model="profile.name" label="Full Name *" :rules="[val => !!val || 'Required']" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined dense v-model="profile.email" label="Email Address *" type="email" readonly bg-color="grey-2" hint="Contact super-admin to change email" />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input outlined dense v-model="profile.phone" label="Phone Number *" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined dense v-model="profile.role" label="Role" readonly bg-color="grey-2" />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-md">Security</div>
              <q-btn outline color="primary" label="Change Password" icon="lock" class="q-mb-md" />

              <div class="q-mt-xl text-right">
                <q-btn color="primary" type="submit" label="Save Changes" unelevated class="text-weight-bold" padding="10px 24px" :loading="isSaving" />
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
const isLoading = ref(true)
const isSaving = ref(false)
const fileInput = ref(null)

const LOCAL_STORAGE_KEY = 'admin_profile_data'
const profile = ref({ name: '', email: '', phone: '', role: 'Admin', avatar: '' })

onMounted(() => {
  setTimeout(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      profile.value = JSON.parse(saved)
    } else {
      // Default initial data
      profile.value = {
        name: 'Admin User',
        email: 'admin@iching.com',
        phone: '01959609090',
        role: 'System Administrator',
        avatar: ''
      }
    }
    isLoading.value = false
  }, 500)
})

const triggerUpload = () => fileInput.value.click()

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target.result;
      saveProfileSilently()
    }
    reader.readAsDataURL(file)
  }
}

const saveProfileSilently = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile.value))
}

const saveProfile = () => {
  isSaving.value = true
  setTimeout(() => {
    saveProfileSilently()
    $q.notify({ type: 'positive', message: 'Admin profile updated successfully!', position: 'top-right' })
    isSaving.value = false
  }, 600)
}
</script>
