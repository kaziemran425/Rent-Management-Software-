<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Global Configuration</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage platform-wide property, financial, and payment rules</div>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-lg">

      <div class="col-12 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders bg-white">
          <q-tabs
            v-model="tab"
            vertical
            class="text-grey-8"
            active-color="primary"
            active-bg-color="blue-1"
            indicator-color="primary"
          >
            <q-tab name="general" icon="business" label="General Info" class="q-py-md text-weight-bold justify-start" />
            <q-tab name="financial" icon="account_balance" label="Financial Rules" class="q-py-md text-weight-bold justify-start" />
            <q-tab name="payment" icon="payments" label="Payment Gateways" class="q-py-md text-weight-bold justify-start" />
          </q-tabs>
        </q-card>
      </div>

      <div class="col-12 col-md-9">
        <q-card flat bordered class="shadow-1 rounded-borders bg-white fit">
          <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" class="bg-transparent">

            <q-tab-panel name="general" class="q-pa-xl">
              <div class="q-mb-lg">
                <div class="text-h5 text-weight-bolder text-dark">Property Details</div>
                <div class="text-caption text-grey-7">Basic information displayed on tenant invoices and the portal.</div>
              </div>

              <q-form @submit.prevent="saveSettings('General')" class="q-gutter-y-md" style="max-width: 600px;">
                <q-input outlined v-model="settings.propertyName" label="Management Company / Property Name" :rules="[val => !!val || 'Name is required']">
                  <template v-slot:prepend><q-icon name="apartment" color="grey-7" /></template>
                </q-input>

                <q-input outlined v-model="settings.contactEmail" label="Support Email" type="email" :rules="[val => !!val || 'Email is required']">
                  <template v-slot:prepend><q-icon name="email" color="grey-7" /></template>
                </q-input>

                <q-input outlined v-model="settings.contactPhone" label="Emergency Phone" mask="###########">
                  <template v-slot:prepend><q-icon name="phone" color="grey-7" /></template>
                </q-input>

                <div class="q-mt-xl">
                  <q-btn type="submit" color="primary" label="Save General Settings" unelevated class="text-weight-bold" :loading="isSaving" padding="10px 24px" />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="financial" class="q-pa-xl">
              <div class="q-mb-lg">
                <div class="text-h5 text-weight-bolder text-dark">Rent & Late Fees</div>
                <div class="text-caption text-grey-7">Configure automated penalty rules and billing cycles.</div>
              </div>

              <q-form @submit.prevent="saveSettings('Financial')" class="q-gutter-y-md" style="max-width: 600px;">
                <q-input outlined v-model.number="settings.rentDueDay" label="Default Rent Due Day" type="number" hint="e.g., 1 for the 1st of the month" :rules="[val => val > 0 && val <= 31 || 'Must be between 1 and 31']">
                  <template v-slot:prepend><q-icon name="event" color="grey-7" /></template>
                </q-input>

                <q-input outlined v-model.number="settings.gracePeriod" label="Grace Period (Days)" type="number" hint="Number of days before late fee applies">
                  <template v-slot:prepend><q-icon name="hourglass_empty" color="grey-7" /></template>
                </q-input>

                <q-input outlined v-model.number="settings.lateFeeAmount" label="Late Fee Amount (৳)" type="number">
                  <template v-slot:prepend><q-icon name="money_off" color="grey-7" /></template>
                </q-input>

                <div class="q-mt-xl">
                  <q-btn type="submit" color="primary" label="Save Financial Rules" unelevated class="text-weight-bold" :loading="isSaving" padding="10px 24px" />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="payment" class="q-pa-xl">
              <div class="q-mb-lg">
                <div class="text-h5 text-weight-bolder text-dark">Bank & Gateway Configuration</div>
                <div class="text-caption text-grey-7">Manage how tenants can pay their rent securely.</div>
              </div>

              <q-form @submit.prevent="saveSettings('Payment')" class="q-gutter-y-lg" style="max-width: 600px;">

                <q-card flat bordered class="q-pa-md bg-grey-1 gateway-card">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="text-subtitle1 text-weight-bold row items-center">
                      <q-icon name="credit_card" color="primary" size="sm" class="q-mr-sm" /> Digital Payments
                    </div>
                    <q-toggle v-model="settings.enableStripe" color="primary" />
                  </div>

                  <q-slide-transition>
                    <div v-show="settings.enableStripe" class="q-mt-md q-gutter-y-sm">
                      <q-input outlined dense v-model="settings.stripeKey" label="API Public Key" bg-color="white" />
                      <q-input outlined dense v-model="settings.stripeSecret" label="API Secret Key" bg-color="white" type="password" />
                    </div>
                  </q-slide-transition>
                </q-card>

                <q-card flat bordered class="q-pa-md bg-grey-1 gateway-card">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="text-subtitle1 text-weight-bold row items-center">
                      <q-icon name="account_balance" color="primary" size="sm" class="q-mr-sm" /> Direct Bank Transfer
                    </div>
                    <q-toggle v-model="settings.enableBank" color="primary" />
                  </div>

                  <q-slide-transition>
                    <div v-show="settings.enableBank" class="q-mt-md">
                      <q-input
                        outlined
                        dense
                        type="textarea"
                        v-model="settings.bankDetails"
                        label="Bank Information (Visible on Invoices)"
                        bg-color="white"
                        rows="4"
                      />
                    </div>
                  </q-slide-transition>
                </q-card>

                <div class="q-mt-xl">
                  <q-btn type="submit" color="primary" label="Save Payment Gateways" unelevated class="text-weight-bold" :loading="isSaving" padding="10px 24px" />
                </div>
              </q-form>
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- UI State ---
const tab = ref('general')
const isLoading = ref(true)
const isSaving = ref(false)

// --- Data State ---
const settings = ref({
  propertyName: 'Iching Residences',
  contactEmail: 'admin@iching.com',
  contactPhone: '01959609090',
  rentDueDay: 1,
  lateFeeAmount: 500, // Taka
  gracePeriod: 5,
  enableStripe: false,
  stripeKey: '',
  stripeSecret: '',
  enableBank: true,
  bankDetails: 'Bank Name: City Bank\nAccount Title: Iching Software Lab\nAccount No: 123456789\nRouting: 987654321'
})

const LOCAL_STORAGE_KEY = 'house_rent_global_settings'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchSettings()
})

const fetchSettings = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/settings')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      settings.value = JSON.parse(savedData)
    }
    isLoading.value = false
  }, 500) // Simulated network fetch
}

// --- Methods ---
const saveSettings = (sectionName) => {
  isSaving.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.post('/api/settings', settings.value)
  setTimeout(() => {
    // Explicitly save to LocalStorage upon clicking the submit button
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings.value))

    $q.notify({
      type: 'positive',
      message: `${sectionName} settings updated successfully!`,
      position: 'top-right',
      icon: 'check_circle'
    })

    isSaving.value = false
  }, 800) // Simulated database write delay
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
.gateway-card {
  border-radius: 8px;
  transition: border-color 0.3s ease;
}
.gateway-card:hover {
  border-color: var(--q-primary);
}
</style>
