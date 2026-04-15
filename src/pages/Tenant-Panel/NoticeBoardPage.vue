<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Notice Board</h4>
      <div class="text-subtitle2 text-grey-7">Important announcements from management.</div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12" v-for="notice in notices" :key="notice.id">
        <q-card bordered class="shadow-1">
          <q-card-section :class="notice.urgent ? 'bg-red-1' : 'bg-grey-1'">
            <div class="row justify-between items-center">
              <div class="text-h6">
                <q-icon name="warning" color="negative" class="q-mr-sm" v-if="notice.urgent" />
                {{ notice.title }}
              </div>
              <div class="text-caption text-grey-8">{{ notice.date }}</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <p class="text-body1 q-ma-none">{{ notice.content }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const notices = ref([
  {
    id: 1,
    date: 'April 14, 2026',
    title: 'Water Supply Interruption',
    content: 'Please be advised that the water supply will be interrupted on April 16th between 10 AM and 2 PM for scheduled maintenance.',
    urgent: true
  },
  {
    id: 2,
    date: 'April 01, 2026',
    title: 'Welcome to the New Tenant Portal',
    content: 'We are excited to launch our new portal. You can now pay rent, submit complaints, and message us directly through this system.',
    urgent: false
  }
])
</script>
