<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Welcome Back, Kazi Emran</div>
        <div class="text-subtitle1 text-grey-7">Unit: A-101 | Green Valley Residency</div>
      </div>
      <q-btn color="indigo-9" icon="payments" label="Pay Rent Now" unelevated to="/RentRecord" />
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-indigo-9 text-white">
          <q-card-section>
            <div class="text-subtitle2 text-indigo-2 text-uppercase text-bold">Current Amount Due</div>
            <div class="text-h3 text-bold q-mt-sm">৳ 14,500</div>
            <div class="text-caption q-mt-xs">Due by: 05 May 2026</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">Active Support Tickets</div>
            <div class="text-h3 text-bold text-orange-9 q-mt-sm">1</div>
            <div class="text-caption text-grey-6 q-mt-xs">Plumbing Issue (In Progress)</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">Next Lease Renewal</div>
            <div class="text-h3 text-bold text-indigo-9 q-mt-sm">Dec 2026</div>
            <div class="text-caption text-grey-6 q-mt-xs">8 Months Remaining</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section class="bg-grey-2 row items-center">
            <q-icon name="campaign" size="sm" color="indigo-9" class="q-mr-sm" />
            <div class="text-h6 text-bold text-indigo-9">Building Announcements</div>
          </q-card-section>
          
          <q-list separator>
            <q-item v-if="notices.length === 0" class="q-pa-md text-grey-7">
              No recent announcements.
            </q-item>
            <q-item v-for="notice in notices.slice(0, 3)" :key="notice.id" class="q-pa-md">
              <q-item-section avatar>
                <q-avatar color="indigo-1" text-color="indigo-9" icon="notifications" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold text-grey-9 text-body1">{{ notice.subject }}</q-item-label>
                <q-item-label caption class="q-mt-xs text-grey-7" v-html="notice.body || 'Please check your email for details.'"></q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption class="text-bold">{{ notice.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const notices = ref([])

onMounted(() => {
  // Pull notices created by the Admin!
  const savedNotices = localStorage.getItem('house_rent_notices')
  if (savedNotices) {
    notices.value = JSON.parse(savedNotices)
  } else {
    notices.value = [
      { id: 1, date: '2026-04-10', subject: 'Water Tank Cleaning Tomorrow', body: 'Water supply will be paused from 10 AM to 2 PM.' }
    ]
  }
})
</script>