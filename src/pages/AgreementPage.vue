<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4 text-bold text-indigo-9">Lease Agreement</div>
      <q-btn outline color="indigo-9" icon="print" label="Print Agreement" @click="printPage" />
    </div>

    <q-card flat bordered class="shadow-2 bg-white">
      <q-card-section class="row q-col-gutter-xl">
        
        <div class="col-12 col-md-8">
          <div class="text-h6 text-indigo-9 q-mb-md text-bold">Terms & Conditions</div>
          
          <q-scroll-area style="height: 400px; border: 1px solid #e0e0e0; border-radius: 8px;" class="q-pa-md bg-grey-1">
            <div class="text-body1 text-grey-9" style="line-height: 1.8;">
              <p><strong>1. Parties:</strong> This agreement is made between Property Management BD (Landlord) and Kazi Emran (Tenant).</p>
              <p><strong>2. Premises:</strong> The landlord agrees to rent the premises located at Unit A-101, Green Valley Residency.</p>
              <p><strong>3. Term:</strong> The lease shall commence on Jan 1, 2026, and end on Dec 31, 2026.</p>
              <p><strong>4. Rent:</strong> Tenant agrees to pay a monthly base rent of ৳ 12,000, due by the 5th of each month.</p>
              <p><strong>5. Security Deposit:</strong> A deposit of ৳ 24,000 has been paid. This will be refunded upon move-out, minus any damages.</p>
              <p><strong>6. Utilities:</strong> Tenant is responsible for paying electricity based on meter usage, and a fixed ৳ 1,000 for Gas/Water.</p>
              <br><br>
              <div class="row justify-between q-mt-xl">
                <div>
                  <div class="q-mb-xs">_____________________</div>
                  <div class="text-caption">Tenant Signature</div>
                </div>
                <div>
                  <div class="q-mb-xs">_____________________</div>
                  <div class="text-caption">Landlord Signature</div>
                </div>
              </div>
            </div>
          </q-scroll-area>
        </div>

        <div class="col-12 col-md-4">
          <div class="text-h6 text-indigo-9 q-mb-md text-bold">Verified Documents</div>
          <q-card flat bordered class="bg-grey-2 q-pa-sm q-mb-md">
            <div class="text-subtitle2 text-grey-7 q-mb-sm text-center">National ID (Front)</div>
            <q-img src="https://cdn.quasar.dev/img/material.png" :ratio="16/9" class="rounded-borders" />
          </q-card>
          <q-card flat bordered class="bg-grey-2 q-pa-sm">
            <div class="text-subtitle2 text-grey-7 q-mb-sm text-center">National ID (Back)</div>
            <q-img src="https://cdn.quasar.dev/img/material.png" :ratio="16/9" class="rounded-borders" />
          </q-card>
        </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const printPage = () => {
  window.print()
}
</script>