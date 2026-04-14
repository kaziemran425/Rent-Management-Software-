<template>
  <q-page class="q-pa-lg flex flex-center bg-grey-1">
    <div style="width: 100%; max-width: 900px">
      <div class="text-h4 text-bold text-indigo-9 q-mb-lg">Account Settings</div>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-card bordered flat class="shadow-2 bg-white">
            <q-card-section class="bg-indigo-1">
              <div class="text-h6 text-indigo-9 text-bold">Personal Profile</div>
            </q-card-section>
            <q-card-section class="q-pa-lg">
              <q-form class="q-gutter-md" @submit.prevent="updateProfile">
                <q-input v-model="user.name" label="Full Name" outlined dense>
                  <template v-slot:prepend><q-icon name="person" /></template>
                </q-input>
                <q-input v-model="user.email" label="Email Address" outlined dense readonly bg-color="grey-2">
                  <template v-slot:prepend><q-icon name="email" /></template>
                </q-input>
                <q-input v-model="user.phone" label="Phone Number" mask="###########" outlined dense>
                  <template v-slot:prepend><q-icon name="phone" /></template>
                </q-input>
                <div class="row justify-end q-mt-md">
                  <q-btn label="UPDATE PROFILE" color="indigo-9" type="submit" unelevated class="text-bold" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card bordered flat class="shadow-2 bg-white">
            <q-card-section class="bg-red-1">
              <div class="text-h6 text-negative text-bold">Security</div>
            </q-card-section>
            <q-card-section class="q-pa-lg">
              <q-form class="q-gutter-md" @submit.prevent="changePassword">
                <q-input v-model="pass.current" type="password" label="Current Password" outlined dense />
                <q-input v-model="pass.new" type="password" label="New Password" outlined dense />
                <q-input 
                  v-model="pass.confirm" 
                  type="password" 
                  label="Confirm New Password" 
                  outlined 
                  dense 
                  :rules="[val => val === pass.new || 'Passwords must match']"
                />
                <div class="row justify-end q-mt-md">
                  <q-btn label="CHANGE PASSWORD" color="negative" outline type="submit" class="text-bold" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Mock logged-in user data
const user = reactive({ 
  name: 'Kazi Emran', 
  email: 'emran@example.com', 
  phone: '01959609090' 
})

const pass = reactive({ current: '', new: '', confirm: '' })

const updateProfile = () => {
  // INTEGRATION POINT: axios.put('/api/users/profile', user)
  $q.notify({ type: 'positive', message: 'Profile updated successfully!', position: 'top' })
}

const changePassword = () => {
  // INTEGRATION POINT: axios.put('/api/users/password', pass)
  $q.notify({ type: 'positive', message: 'Password changed successfully!', position: 'top' })
  pass.current = ''
  pass.new = ''
  pass.confirm = ''
}
</script>