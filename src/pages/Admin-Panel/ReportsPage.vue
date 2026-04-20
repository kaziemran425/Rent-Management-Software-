<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Financial Reports</h4>
      <q-btn color="primary" icon="print" label="Export PDF" outline class="bg-white text-weight-bold" @click="exportReport" />
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="3em" /></div>

    <div v-else>
      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12 col-md-4">
          <q-card bordered class="bg-primary text-white shadow-2 q-pa-md rounded-borders">
            <div class="text-subtitle2 text-blue-2 text-uppercase text-weight-bold">Total Revenue (Collected)</div>
            <div class="text-h3 text-weight-bolder q-mt-sm">৳ {{ totalRevenue.toLocaleString() }}</div>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card bordered class="bg-negative text-white shadow-2 q-pa-md rounded-borders">
            <div class="text-subtitle2 text-red-2 text-uppercase text-weight-bold">Pending Dues (Unpaid)</div>
            <div class="text-h3 text-weight-bolder q-mt-sm">৳ {{ totalDues.toLocaleString() }}</div>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card bordered class="bg-info text-white shadow-2 q-pa-md rounded-borders">
            <div class="text-subtitle2 text-cyan-2 text-uppercase text-weight-bold">Building Occupancy Rate</div>
            <div class="text-h3 text-weight-bolder q-mt-sm">{{ occupancyRate }}%</div>
          </q-card>
        </div>
      </div>

      <q-card flat bordered class="shadow-1 rounded-borders bg-white">
        <q-card-section class="bg-grey-2 border-bottom">
          <div class="text-h6 text-weight-bold">Monthly Collection Breakdown</div>
        </q-card-section>
        <q-table :rows="reportData" :columns="columns" row-key="month" flat :pagination="{ rowsPerPage: 12 }" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const isLoading = ref(true)
const invoices = ref([])
const flats = ref([])

const columns = [
  { name: 'month', label: 'Billing Month', field: 'month', align: 'left', sortable: true },
  { name: 'collected', label: 'Total Collected (৳)', field: 'collected', align: 'right', format: val => val.toLocaleString() },
  { name: 'pending', label: 'Pending Dues (৳)', field: 'pending', align: 'right', format: val => val.toLocaleString() }
]

onMounted(() => {
  setTimeout(() => {
    // Fetch real data from other connected panels
    invoices.value = JSON.parse(localStorage.getItem('tenant_invoice_records') || '[]')
    flats.value = JSON.parse(localStorage.getItem('house_rent_flats') || '[]')
    isLoading.value = false
  }, 600)
})

// Calculate Total Revenue (only paid invoices)
const totalRevenue = computed(() => {
  return invoices.value.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0)
})

// Calculate Pending Dues (unpaid/pending invoices)
const totalDues = computed(() => {
  return invoices.value.filter(i => i.status !== 'paid').reduce((sum, i) => sum + Number(i.amount), 0)
})

// Calculate Occupancy Rate based on Flat statuses
const occupancyRate = computed(() => {
  if (!flats.value.length) return 0 // Default if no flats are setup
  const occupied = flats.value.filter(f => f.status === 'Occupied').length
  return Math.round((occupied / flats.value.length) * 100)
})

// Transform raw invoice data into monthly summary
const reportData = computed(() => {
  const dataMap = {}
  invoices.value.forEach(inv => {
    if (!dataMap[inv.month]) {
      dataMap[inv.month] = { month: inv.month, collected: 0, pending: 0 }
    }
    if (inv.status === 'paid') {
      dataMap[inv.month].collected += Number(inv.amount)
    } else {
      dataMap[inv.month].pending += Number(inv.amount)
    }
  })
  return Object.values(dataMap)
})

const exportReport = () => {
  window.print()
}
</script>
