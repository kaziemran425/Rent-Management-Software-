<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">My Profile</h4>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card bordered class="shadow-1">
          <q-card-section>
            <div class="text-h6 q-mb-md">Personal Information</div>
            <q-form class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="profile.firstName" label="First Name" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="profile.lastName" label="Last Name" />
                </div>
              </div>

              <q-input outlined v-model="profile.email" label="Email Address" type="email" readonly hint="Contact admin to change email" />
              <q-input outlined v-model="profile.phone" label="Phone Number" />

              <q-separator class="q-my-md" />

              <div class="text-h6 q-mb-md">Emergency Contact</div>
              <q-input outlined v-model="profile.emergencyName" label="Contact Name" />
              <q-input outlined v-model="profile.emergencyPhone" label="Contact Phone" />

              <div class="q-mt-lg text-right">
                <q-btn color="primary" label="Save Profile" @click="saveProfile" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered class="shadow-1 q-mb-md text-center q-pa-md">
          <q-avatar size="100px" class="shadow-2 q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-h6">{{ profile.firstName }} {{ profile.lastName }}</div>
          <div class="text-caption text-grey-7">Apt 4B - Building North</div>
          <q-btn outline color="primary" label="Update Photo" class="q-mt-md" size="sm" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 555 123 4567',
  emergencyName: 'Jane Doe',
  emergencyPhone: '+1 555 987 6543'
})

const saveProfile = () => {
  $q.notify({
    type: 'positive',
    message: 'Profile updated successfully.'
  })
}
</script>
