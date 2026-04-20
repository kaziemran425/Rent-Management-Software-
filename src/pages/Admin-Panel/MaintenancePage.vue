<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Maintenance Control</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage and resolve tenant maintenance requests</div>
      </div>
      <q-btn color="primary" icon="refresh" label="Refresh Data" outline class="text-weight-bold bg-white" @click="fetchTickets" />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Action Required (Open)</div>
              <div class="text-h4 text-weight-bolder text-negative q-mt-sm">{{ openCount }}</div>
            </div>
            <q-avatar size="50px" color="red-1" text-color="negative" icon="report_problem" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Work In Progress</div>
              <div class="text-h4 text-weight-bolder text-info q-mt-sm">{{ inProgressCount }}</div>
            </div>
            <q-avatar size="50px" color="blue-1" text-color="info" icon="engineering" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Resolved</div>
              <div class="text-h4 text-weight-bolder text-positive q-mt-sm">{{ resolvedCount }}</div>
            </div>
            <q-avatar size="50px" color="green-1" text-color="positive" icon="task_alt" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders bg-white">
      <q-table :rows="tickets" :columns="columns" row-key="id" flat :loading="isLoading">

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.status === 'resolved' ? 'positive' : props.row.status === 'in_progress' ? 'info' : 'negative'">
              {{ props.row.status.toUpperCase() }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right" class="q-gutter-sm">
            <q-btn v-if="props.row.status === 'open'" size="sm" color="info" label="Start Work" unelevated @click="updateStatus(props.row.id, 'in_progress')" />
            <q-btn v-if="props.row.status !== 'resolved'" size="sm" color="positive" label="Mark Resolved" unelevated @click="updateStatus(props.row.id, 'resolved')" />
            <q-btn size="sm" color="negative" icon="delete" flat round @click="deleteTicket(props.row.id)" />
          </q-td>
        </template>

      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)

const LOCAL_STORAGE_KEY = 'tenant_maintenance_requests' // BRIDGE KEY!
const tickets = ref([])

const columns = [
  { name: 'id', label: 'Ticket ID', field: 'id', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'tenant', label: 'Tenant', field: 'tenant', align: 'left' },
  { name: 'flat', label: 'Flat', field: 'flat', align: 'left' },
  { name: 'title', label: 'Issue', field: 'title', align: 'left' },
  { name: 'priority', label: 'Priority', field: 'priority', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

onMounted(() => { fetchTickets() })

const fetchTickets = () => {
  isLoading.value = true
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      tickets.value = JSON.parse(savedData)
    }
    isLoading.value = false
  }, 500)
}

watch(tickets, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// KPI Computations
const openCount = computed(() => tickets.value.filter(t => t.status === 'open').length)
const inProgressCount = computed(() => tickets.value.filter(t => t.status === 'in_progress').length)
const resolvedCount = computed(() => tickets.value.filter(t => t.status === 'resolved').length)

// Admin Updating the Status
const updateStatus = (id, newStatus) => {
  const index = tickets.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tickets.value[index].status = newStatus
    $q.notify({ type: 'positive', message: `Ticket ${id} marked as ${newStatus.replace('_', ' ')}` })
  }
}

const deleteTicket = (id) => {
  $q.dialog({
    title: 'Confirm', message: 'Delete this request?', cancel: true
  }).onOk(() => {
    tickets.value = tickets.value.filter(t => t.id !== id)
  })
}
</script>
