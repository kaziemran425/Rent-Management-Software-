<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Lease Agreement</h4>
    </div>

    <q-card bordered class="shadow-1" style="max-width: 800px;">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="text-h6">Standard Residential Lease</div>
          <StatusBadge :status="agreementStatus" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="scroll" style="max-height: 400px;">
        <p class="text-body1">
          <strong>1. Terms:</strong> This agreement commences on May 1st, 2026 and continues for a period of 12 months.<br><br>
          <strong>2. Rent:</strong> Tenant agrees to pay $850.00 per month, due on the 1st of every month.<br><br>
          <strong>3. Maintenance:</strong> Landlord is responsible for structural repairs. Tenant is responsible for basic upkeep...
        </p>
        </q-card-section>

      <q-separator />

      <q-card-section v-if="agreementStatus === 'pending'">
        <q-checkbox v-model="agreed" label="I have read and agree to the terms and conditions outlined above." />
        <div class="q-mt-md">
          <q-btn color="primary" label="Submit Agreement" :disable="!agreed" @click="submitAgreement" />
        </div>
      </q-card-section>

      <q-card-section v-else class="text-center bg-green-1 text-green-9">
        <q-icon name="check_circle" size="2em" class="q-mb-sm" />
        <div class="text-subtitle1">Your agreement is currently <strong>{{ agreementStatus }}</strong>.</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()
const agreed = ref(false)
const agreementStatus = ref('pending') // Can be 'pending', 'reviewing', 'active'

const submitAgreement = () => {
  agreementStatus.value = 'reviewing'
  $q.notify({
    type: 'positive',
    message: 'Agreement submitted successfully to the landlord for review.'
  })
}
</script>
