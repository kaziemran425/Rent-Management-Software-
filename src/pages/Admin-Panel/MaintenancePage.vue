<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Maintenance Requests</h4>
      <q-select
        v-model="filterStatus"
        :options="['All', 'Open', 'In Progress', 'Resolved']"
        dense outlined
        label="Filter Status"
        style="width: 200px"
      />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4" v-for="ticket in filteredTickets" :key="ticket.id">
        <q-card bordered class="shadow-1">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-caption text-grey-7">Ticket #{{ ticket.id }}</div>
              <StatusBadge :status="ticket.status" />
            </div>
            <div class="text-h6 q-mb-xs">{{ ticket.title }}</div>
            <div class="text-subtitle2 text-primary">{{ ticket.tenant }} ({{ ticket.flat }})</div>
            <p class="text-body2 q-mt-sm">{{ ticket.description }}</p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Mark In Progress" v-if="ticket.status === 'open'" />
            <q-btn flat color="positive" label="Resolve" v-if="ticket.status !== 'resolved'" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusBadge from 'src/components/StatusBadge.vue'

const filterStatus = ref('All')

const tickets = ref([
  { id: '1042', title: 'Leaking Faucet', tenant: 'Alice Johnson', flat: 'A-101', description: 'The kitchen sink is leaking continuously.', status: 'open' },
  { id: '1043', title: 'AC Not Cooling', tenant: 'Bob Smith', flat: 'B-204', description: 'The master bedroom AC is blowing warm air.', status: 'in_progress' },
  { id: '1044', title: 'Broken Light Fixture', tenant: 'Charlie Brown', flat: 'A-102', description: 'Hallway light is broken.', status: 'resolved' }
])

const filteredTickets = computed(() => {
  if (filterStatus.value === 'All') return tickets.value
  const mapStatus = { 'Open': 'open', 'In Progress': 'in_progress', 'Resolved': 'resolved' }
  return tickets.value.filter(t => t.status === mapStatus[filterStatus.value])
})
</script>
