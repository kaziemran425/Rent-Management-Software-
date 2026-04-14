<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-bold text-indigo-9">My Rent Records</div>
        <div class="text-subtitle1 text-grey-7">Track your monthly payments and invoices</div>
      </div>
      <q-btn 
        color="indigo-9" 
        outline 
        icon="print" 
        label="Export Statement" 
        @click="exportStatement"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="stats-card text-white bg-indigo-9 shadow-5">
          <q-card-section>
            <div class="text-subtitle2 opacity-80">Total Rent Paid</div>
            <div class="text-h4 text-bold">৳ 1,45,000</div>
          </q-card-section>
          <q-inner-loading :showing="loading">
            <q-spinner-gears size="50px" color="white" />
          </q-inner-loading>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="stats-card text-indigo-9 bg-white shadow-2">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Current Month Due</div>
            <div class="text-h4 text-bold text-negative">৳ 12,500</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="stats-card text-indigo-9 bg-white shadow-2">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Security Deposit</div>
            <div class="text-h4 text-bold text-positive">৳ 30,000</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mb-md bg-white">
      <q-card-section class="row q-gutter-md items-center">
        <q-input 
          v-model="search" 
          placeholder="Search by month or invoice..." 
          outlined 
          dense 
          class="col-grow"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <q-select 
          v-model="yearFilter" 
          :options="['2026', '2025', '2024']" 
          label="Year" 
          outlined 
          dense 
          style="min-width: 120px" 
        />
      </q-card-section>
    </q-card>

    <q-table
      :rows="records"
      :columns="columns"
      row-key="invoiceId"
      flat
      bordered
      :filter="search"
      class="my-sticky-header-table shadow-2"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.status === 'Paid' ? 'positive' : 'warning'"
            text-color="white"
            size="sm"
            class="text-bold"
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn 
            flat 
            round 
            color="indigo-9" 
            icon="description" 
            size="sm" 
            @click="viewInvoice(props.row)"
          >
            <q-tooltip>View Details</q-tooltip>
          </q-btn>
          <q-btn 
            flat 
            round 
            color="primary" 
            icon="download" 
            size="sm" 
            @click="downloadPDF(props.row)"
          >
            <q-tooltip>Download PDF</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showDetail">
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="bg-indigo-9 text-white row items-center">
          <div class="text-h6">Invoice Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="row justify-between q-mb-md">
            <div class="text-grey-7">Invoice ID:</div>
            <div class="text-bold">{{ activeInvoice.invoiceId }}</div>
          </div>
          <q-separator />
          <div class="q-mt-md">
            <div class="row justify-between q-py-xs">
              <div>Basic Rent:</div>
              <div>৳ {{ activeInvoice.basicRent }}</div>
            </div>
            <div class="row justify-between q-py-xs">
              <div>Electricity:</div>
              <div>৳ {{ activeInvoice.electricity }}</div>
            </div>
            <div class="row justify-between q-py-xs">
              <div>Water/Gas:</div>
              <div>৳ {{ activeInvoice.utility }}</div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between text-h6 text-indigo-9 text-bold">
              <div>Total Amount:</div>
              <div>৳ {{ activeInvoice.amount }}</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Close" color="grey-8" v-close-popup />
          <q-btn unelevated label="Print Invoice" color="indigo-9" icon="print" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')
const yearFilter = ref('2026')
const loading = ref(false)
const showDetail = ref(false)
const activeInvoice = ref({})

const columns = [
  { name: 'invoiceId', align: 'left', label: 'Invoice #', field: 'invoiceId', sortable: true },
  { name: 'month', align: 'left', label: 'Month', field: 'month', sortable: true },
  { name: 'datePaid', align: 'left', label: 'Date Paid', field: 'datePaid' },
  { name: 'amount', align: 'center', label: 'Amount (৳)', field: 'amount', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status' },
  { name: 'actions', align: 'right', label: 'Actions' }
]

const records = ref([
  { invoiceId: 'INV-9901', month: 'March 2026', datePaid: '05 Mar 2026', amount: 12500, status: 'Paid', basicRent: 10000, electricity: 1500, utility: 1000 },
  { invoiceId: 'INV-9850', month: 'February 2026', datePaid: '02 Feb 2026', amount: 12500, status: 'Paid', basicRent: 10000, electricity: 1500, utility: 1000 },
  { invoiceId: 'INV-9812', month: 'January 2026', datePaid: '07 Jan 2026', amount: 12800, status: 'Paid', basicRent: 10000, electricity: 1800, utility: 1000 },
  { invoiceId: 'INV-9988', month: 'April 2026', datePaid: '-', amount: 12500, status: 'Pending', basicRent: 10000, electricity: 1500, utility: 1000 }
])

const viewInvoice = (row) => {
  activeInvoice.value = row
  showDetail.value = true
}

const downloadPDF = (row) => {
  $q.notify({
    type: 'info',
    message: `Downloading invoice ${row.invoiceId} as PDF...`,
    position: 'top'
  })
}

const exportStatement = () => {
  $q.notify({
    type: 'positive',
    message: 'Full payment statement exported successfully.',
    icon: 'done_all'
  })
}
</script>

<style scoped>
.stats-card {
  border-radius: 12px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.opacity-80 {
  opacity: 0.8;
}
.my-sticky-header-table {
  border-radius: 8px;
  background-color: white;
}
</style>