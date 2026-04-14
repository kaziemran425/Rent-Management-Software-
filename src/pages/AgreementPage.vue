<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-bold text-indigo-9 q-mb-lg">Rental Agreement</div>

    <q-card flat bordered class="bg-white">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <div class="bg-grey-2 q-pa-md rounded-borders">
            <div class="text-subtitle2 text-grey-7">Property Detail</div>
            <div class="text-h6 text-bold">Building A - Flat 402</div>
            <q-separator class="q-my-md" />
            <div class="text-subtitle2 text-grey-7">Lease Term</div>
            <div class="text-body1">Jan 2026 - Dec 2026</div>
            <q-separator class="q-my-md" />
            <q-btn color="indigo-9" icon="download" label="Download Agreement PDF" class="full-width" />
          </div>
        </div>

        <div class="col-12 col-md-8">
          <div class="text-h6 q-mb-sm">Agreement Terms</div>
          <div class="agreement-text text-body1 text-grey-9">
            <p>1. The tenant agrees to pay a monthly rent of ৳ 12,500 by the 5th of each month.</p>
            <p>2. A security deposit of ৳ 30,000 has been received by the owner.</p>
            <p>3. Tenant is responsible for electricity and gas bills based on usage.</p>
            <p>4. Sub-letting of the property is strictly prohibited.</p>
          </div>
          
          <div class="text-h6 q-mt-lg q-mb-sm">Uploaded Documents</div>
          <div class="row q-gutter-md">
            <q-card bordered flat style="width: 150px">
              <q-img src="https://cdn.quasar.dev/img/material.png" :ratio="1">
                <div class="absolute-bottom text-subtitle2 text-center">NID Front</div>
              </q-img>
            </q-card>
            <q-card bordered flat style="width: 150px">
              <q-img src="https://cdn.quasar.dev/img/material.png" :ratio="1">
                <div class="absolute-bottom text-subtitle2 text-center">NID Back</div>
              </q-img>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.agreement-text {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
}
</style>