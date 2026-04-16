<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Maintenance Requests</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Track, manage, and resolve tenant issues</div>
      </div>
      <q-btn
        color="primary"
        icon="refresh"
        label="Refresh"
        outline
        class="text-weight-bold bg-white"
        padding="8px 16px"
        @click="fetchTickets"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Requests</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-sm">{{ totalTickets }}</div>
            </div>
            <q-avatar size="50px" color="grey-2" text-color="dark" icon="receipt_long" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Open Action Required</div>
              <div class="text-h4 text-weight-bolder text-negative q-mt-sm">{{ openTickets }}</div>
            </div>
            <q-avatar size="50px" color="red-1" text-color="negative" icon="report_problem" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">In Progress</div>
              <div class="text-h4 text-weight-bolder text-primary q-mt-sm">{{ inProgressTickets }}</div>
            </div>
            <q-avatar size="50px" color="blue-1" text-color="primary" icon="engineering" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Resolved</div>
              <div class="text-h4 text-weight-bolder text-positive q-mt-sm">{{ resolvedTickets }}</div>
            </div>
            <q-avatar size="50px" color="green-1" text-color="positive" icon="task_alt" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-gutter-sm items-center q-mb-md">
      <q-select
        v-model="filterStatus"
        :options="['All', 'Open', 'In Progress', 'Resolved']"
        outlined
        dense
        bg-color="white"
        options-dense
        label="Filter by Status"
        style="width: 200px"
        class="shadow-1 rounded-borders"
      />
      <q-input
        outlined
        dense
        debounce="300"
        v-model="searchQuery"
        placeholder="Search tickets, tenants, or flats..."
        bg-color="white"
        class="col-grow shadow-1 rounded-borders"
      >
        <template v-slot:append>
          <q-icon name="search" color="grey-6" />
        </template>
      </q-input>
    </div>

    <div v-if="isPageLoading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="filteredTickets.length === 0" class="flex flex-center q-pa-xl text-grey-6 text-center bg-white shadow-1 rounded-borders">
      <div>
        <q-icon name="check_circle_outline" size="80px" color="grey-4" />
        <div class="text-h5 text-weight-bold q-mt-md text-dark">No tickets found</div>
        <div class="q-mt-sm">You're all caught up! There are no maintenance requests matching your criteria.</div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="ticket in filteredTickets" :key="ticket.id">
        <q-card bordered flat class="shadow-1 ticket-card column fit bg-white">
          <q-card-section class="col">
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-caption text-weight-bold text-grey-7">
                <q-icon name="tag" size="xs" /> {{ ticket.id }}
                <span class="q-ml-sm q-pl-sm" style="border-left: 1px solid #e0e0e0">{{ ticket.date }}</span>
              </div>
              <StatusBadge :status="ticket.status" />
            </div>

            <div class="text-h6 text-weight-bolder text-dark q-mb-xs line-height-tight">{{ ticket.title }}</div>
            <div class="text-subtitle2 text-primary row items-center q-mb-sm">
              <q-icon name="person" size="16px" class="q-mr-xs" /> {{ ticket.tenant }}
              <q-icon name="meeting_room" size="16px" class="q-ml-sm q-mr-xs" /> {{ ticket.flat }}
            </div>

            <q-separator class="q-my-sm" />
            <p class="text-body2 text-grey-8 q-mt-sm q-mb-none">{{ ticket.description }}</p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="bg-grey-1 q-px-md">
            <q-btn flat round color="grey-6" icon="delete" size="sm" class="absolute-left q-ml-sm q-mt-sm" @click="confirmDelete(ticket.id)">
               <q-tooltip>Delete Ticket</q-tooltip>
            </q-btn>

            <q-btn
              v-if="ticket.status === 'open'"
              outline
              color="primary"
              label="Mark In Progress"
              class="text-weight-bold"
              @click="updateStatus(ticket.id, 'in_progress')"
            />
            <q-btn
              v-if="ticket.status !== 'resolved'"
              unelevated
              color="positive"
              label="Resolve"
              class="text-weight-bold q-ml-sm"
              @click="updateStatus(ticket.id, 'resolved')"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

// --- UI State ---
const filterStatus = ref('All')
const searchQuery = ref('')
const isPageLoading = ref(true)

// --- Data State ---
const tickets = ref([])

const LOCAL_STORAGE_KEY = 'house_rent_maintenance_tickets'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchTickets()
})

const fetchTickets = () => {
  isPageLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/maintenance')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      tickets.value = JSON.parse(savedData)
    } else {
      // Default Mock Data
      tickets.value = [
        { id: '1042', date: '2026-04-14', title: 'Leaking Faucet', tenant: 'Alice Johnson', flat: 'A-101', description: 'The kitchen sink is leaking continuously and causing water pooling.', status: 'open' },
        { id: '1043', date: '2026-04-12', title: 'AC Not Cooling', tenant: 'Bob Smith', flat: 'B-204', description: 'The master bedroom AC is blowing warm air. Filter was cleaned but issue persists.', status: 'in_progress' },
        { id: '1044', date: '2026-04-10', title: 'Broken Light Fixture', tenant: 'Charlie Brown', flat: 'A-102', description: 'Hallway light is broken and needs replacement.', status: 'resolved' }
      ]
    }
    isPageLoading.value = false
  }, 600) // Simulated network delay
}

// Watcher to auto-save to local storage
watch(tickets, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })


// --- Computed KPIs ---
const totalTickets = computed(() => tickets.value.length)
const openTickets = computed(() => tickets.value.filter(t => t.status === 'open').length)
const inProgressTickets = computed(() => tickets.value.filter(t => t.status === 'in_progress').length)
const resolvedTickets = computed(() => tickets.value.filter(t => t.status === 'resolved').length)

// --- Computed Filters ---
const filteredTickets = computed(() => {
  let result = tickets.value

  // 1. Status Filter
  if (filterStatus.value !== 'All') {
    const mapStatus = { 'Open': 'open', 'In Progress': 'in_progress', 'Resolved': 'resolved' }
    result = result.filter(t => t.status === mapStatus[filterStatus.value])
  }

  // 2. Search Query Filter (Checks title, tenant name, or flat number)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.tenant.toLowerCase().includes(query) ||
      t.flat.toLowerCase().includes(query) ||
      t.id.includes(query)
    )
  }

  // Sort by date (newest first)
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// --- Methods (Actions) ---

const updateStatus = (id, newStatus) => {
  // INTEGRATION POINT: axios.put(`/api/maintenance/${id}/status`, { status: newStatus })

  const index = tickets.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tickets.value[index].status = newStatus

    // UI Feedback
    const statusText = newStatus === 'resolved' ? 'Resolved' : 'marked In Progress'
    const color = newStatus === 'resolved' ? 'positive' : 'primary'

    $q.notify({
      type: color,
      message: `Ticket #${id} has been ${statusText}.`,
      position: 'top-right'
    })
  }
}

const confirmDelete = (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete Ticket #${id}? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Delete', unelevated: true },
    cancel: { flat: true, color: 'grey-8', label: 'Cancel' }
  }).onOk(() => {
    // INTEGRATION POINT: axios.delete(`/api/maintenance/${id}`)
    tickets.value = tickets.value.filter(t => t.id !== id)
    $q.notify({ type: 'info', message: `Ticket #${id} deleted.`, position: 'top-right' })
  })
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.line-height-tight {
  line-height: 1.2;
}
.rounded-borders {
  border-radius: 12px;
}
.ticket-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}
</style>
