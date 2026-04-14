<template>
  <q-page class="q-pa-lg flex flex-center">
    <div style="width: 100%; max-width: 800px">
      <div class="text-h4 text-bold text-indigo-9 q-mb-lg">Profile Settings</div>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-card bordered flat class="bg-white">
            <q-card-section>
              <div class="text-h6 q-mb-md">Personal Information</div>
              <q-form class="q-gutter-md">
                <q-input v-model="user.name" label="Full Name" outlined dense />
                <q-input v-model="user.email" label="Email Address" outlined dense readonly />
                <q-input v-model="user.phone" label="Phone Number" outlined dense />
                <q-btn label="Update Profile" color="indigo-9" unelevated />
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card bordered flat class="bg-white">
            <q-card-section>
              <div class="text-h6 q-mb-md">Security</div>
              <q-form class="q-gutter-md">
                <q-input v-model="pass.current" type="password" label="Current Password" outlined dense />
                <q-input v-model="pass.new" type="password" label="New Password" outlined dense />
                <q-input v-model="pass.confirm" type="password" label="Confirm New Password" outlined dense />
                <q-btn label="Change Password" color="negative" outline />
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
const user = reactive({ name: 'Kazi Emran', email: 'emran@example.com', phone: '01959609090' })
const pass = reactive({ current: '', new: '', confirm: '' })
</script>