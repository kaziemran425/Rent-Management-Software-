<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Property Settings</h4>
    </div>

    <q-card bordered class="shadow-1">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="general" label="General Info" />
        <q-tab name="financial" label="Financial Rules" />
        <q-tab name="payment" label="Payment Gateways" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <div class="text-h6 q-mb-md">Property Details</div>
          <q-form class="q-gutter-md" style="max-width: 600px;">
            <q-input outlined v-model="settings.propertyName" label="Management Company / Property Name" />
            <q-input outlined v-model="settings.contactEmail" label="Support Email" type="email" />
            <q-input outlined v-model="settings.contactPhone" label="Emergency Phone" />
            <q-btn color="primary" label="Save Changes" />
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="financial">
          <div class="text-h6 q-mb-md">Rent & Late Fees</div>
          <q-form class="q-gutter-md" style="max-width: 600px;">
            <q-input outlined v-model="settings.rentDueDay" label="Default Rent Due Day (e.g., 1st of month)" type="number" />
            <q-input outlined v-model="settings.lateFeeAmount" label="Late Fee Amount ($)" type="number" />
            <q-input outlined v-model="settings.gracePeriod" label="Grace Period (Days)" type="number" />
            <q-btn color="primary" label="Save Rules" />
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="payment">
          <div class="text-h6 q-mb-md">Bank & Gateway Configuration</div>
          <div class="q-gutter-md" style="max-width: 600px;">
            <q-card flat bordered class="q-pa-sm bg-grey-1">
              <q-toggle v-model="settings.enableStripe" label="Enable Stripe (Credit Cards)" />
              <div v-if="settings.enableStripe" class="q-mt-sm q-gutter-sm">
                <q-input outlined dense v-model="settings.stripeKey" label="Stripe Public Key" />
                <q-input outlined dense v-model="settings.stripeSecret" label="Stripe Secret Key" />
              </div>
            </q-card>

            <q-card flat bordered class="q-pa-sm bg-grey-1">
              <q-toggle v-model="settings.enableBank" label="Enable Direct Bank Transfer" />
              <div v-if="settings.enableBank" class="q-mt-sm">
                <q-input outlined dense type="textarea" v-model="settings.bankDetails" label="Bank Details (Shown on Invoice)" />
              </div>
            </q-card>

            <q-btn color="primary" label="Save Gateways" class="q-mt-md" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('general')

// In a real app, load this from API or LocalStorage on mount
const settings = ref({
  propertyName: 'Iching Residences',
  contactEmail: 'admin@iching.com',
  contactPhone: '+1 234 567 8900',
  rentDueDay: 1,
  lateFeeAmount: 50,
  gracePeriod: 5,
  enableStripe: true,
  stripeKey: '',
  stripeSecret: '',
  enableBank: true,
  bankDetails: 'Bank Name: Global Trust\nAccount: 123456789\nRouting: 987654321'
})
</script>
