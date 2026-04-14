<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">My Rent Records</div>
        <div class="text-subtitle1 text-grey-7">View past payments and download invoices</div>
      </div>
      <q-btn outline color="indigo-9" icon="file_download" label="Export Statement" />
    </div>

    <q-card flat bordered class="shadow-2">
      <q-table
        :rows="myInvoices"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              :color="props.value === 'Paid' ? 'positive' : 'orange-9'" 
              text-color="white" 
              size="sm"
              class="text-bold"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="indigo-9" icon="download" size="sm" @click="downloadReceipt(props.row)">
              <q-tooltip>Download PDF</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const myInvoices = ref([])

const columns = [
  { name: 'month', label: 'Billing Month', field: 'month', align: 'left', sortable: true },
  { name: 'id', label: 'Invoice #', field: 'id', align: 'left' },
  { name: 'total', label: 'Amount', field: 'total', align: 'center', format: val => `৳ ${Number(val).toLocaleString()}` },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Receipt', align: 'right' }
]

onMounted(() => {
  // Fetch from Admin Invoices and filter only for this tenant
  const savedInvoices = localStorage.getItem('house_rent_invoices')
  if (savedInvoices) {
    const allInvoices = JSON.parse(savedInvoices)
    // Filter logic: Only show invoices belonging to A-101
    myInvoices.value = allInvoices.filter(inv => inv.tenant.includes('A-101'))
  } else {
    myInvoices.value = [
      { id: 'INV-1001', month: '2026-04', total: 14500, status: 'Paid' }
    ]
  }
})

const downloadReceipt = (row) => {
  $q.notify({ type: 'info', message: `Downloading receipt for ${row.month}...`, position: 'top' })
}
</script>