<template>
  <q-page padding>
    <div class="q-mb-lg">
      <h4 class="text-h5 q-my-none text-weight-bold">Welcome back, John!</h4>
      <div class="text-subtitle2 text-grey-7">Here is your tenancy overview.</div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card bordered class="bg-primary text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Next Rent Due</div>
            <div class="text-h4 text-weight-bold">$850.00</div>
            <div class="text-caption q-mt-sm">Due on: May 1st, 2026</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="white" label="Pay Now" to="/tenant/rent-records" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card bordered class="bg-info text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Unread Notices</div>
            <div class="text-h4 text-weight-bold">2</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="white" label="View Notices" to="/tenant/notices" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card bordered class="bg-orange text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Open Requests</div>
            <div class="text-h4 text-weight-bold">1</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="white" label="View Status" to="/tenant/complaints" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Dashboard logic will go here
</script>
