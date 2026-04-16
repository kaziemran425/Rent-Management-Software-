<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bolder text-dark tracking-tight">Financial Ledger</div>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Track all income and expenses across your properties</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Transaction"
        unelevated
        class="text-weight-bold shadow-2"
        padding="8px 16px"
        @click="openAddDialog"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Income</div>
              <div class="text-h4 text-weight-bolder text-positive q-mt-sm">৳ {{ totalIncome.toLocaleString() }}</div>
            </div>
            <q-avatar size="56px" color="green-1" text-color="positive" icon="trending_up" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Expenses</div>
              <div class="text-h4 text-weight-bolder text-negative q-mt-sm">৳ {{ totalExpense.toLocaleString() }}</div>
            </div>
            <q-avatar size="56px" color="red-1" text-color="negative" icon="trending_down" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-primary text-white rounded-borders" style="transform: scale(1.02);">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-blue-2 text-uppercase text-weight-bold">Net Balance</div>
              <div class="text-h4 text-weight-bolder q-mt-sm">৳ {{ netBalance.toLocaleString() }}</div>
            </div>
            <q-avatar size="56px" color="white" text-color="primary" icon="account_balance_wallet" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders">
      <q-table
        :rows="filteredAccounts"
        :columns="accCols"
        row-key="id"
        flat
        :loading="isTableLoading"
        :pagination="{ rowsPerPage: 10 }"
        table-header-class="bg-grey-2 text-dark text-weight-bold"
      >
        <template v-slot:top>
          <div class="text-h6 text-weight-bold text-dark col">Transaction History</div>
          <q-space />
          <div class="row q-gutter-sm items-center">
            <q-select
              v-model="typeFilter"
              :options="['All', 'Income', 'Expense']"
              outlined
              dense
              bg-color="white"
              options-dense
              style="min-width: 130px"
            />
            <q-input outlined dense v-model="searchQuery" placeholder="Search records..." bg-color="white">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              icon="file_download"
              outline
              class="bg-white"
              @click="exportCSV"
            >
              <q-tooltip>Export CSV</q-tooltip>
            </q-btn>
          </div>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'Income' ? 'positive' : 'negative'"
              class="text-weight-bold q-pa-xs q-px-sm"
              rounded
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold" :class="props.row.type === 'Income' ? 'text-positive' : 'text-negative'">
            {{ props.row.type === 'Income' ? '+' : '-' }}৳ {{ Number(props.value).toLocaleString() }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn flat round dense color="grey-6" icon="delete" @click="deleteRecord(props.row.id)">
              <q-tooltip>Delete Record</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 450px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold">New Transaction</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveTransaction" class="q-gutter-y-md">

            <q-select
              v-model="form.type"
              label="Transaction Type *"
              :options="['Income', 'Expense']"
              outlined
              dense
              :rules="[val => !!val || 'Type is required']"
            >
              <template v-slot:prepend>
                <q-icon :name="form.type === 'Income' ? 'trending_up' : 'trending_down'"
                        :color="form.type === 'Income' ? 'positive' : 'negative'" />
              </template>
            </q-select>

            <q-input
              v-model="form.date"
              label="Date *"
              type="date"
              outlined
              dense
              :rules="[val => !!val || 'Date is required']"
            />

            <q-input
              v-model="form.desc"
              label="Description *"
              placeholder="e.g., Plumber repairing Building A"
              outlined
              dense
              :rules="[val => !!val || 'Description is required']"
            >
              <template v-slot:prepend><q-icon name="description" color="grey-7" /></template>
            </q-input>

            <q-input
              v-model.number="form.amount"
              label="Amount (৳) *"
              type="number"
              outlined
              dense
              :rules="[val => !!val || 'Amount is required']"
            >
              <template v-slot:prepend><q-icon name="payments" color="grey-7" /></template>
            </q-input>

            <div class="row justify-end q-mt-xl q-gutter-x-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
              <q-btn
                label="Save Record"
                color="primary"
                type="submit"
                unelevated
                class="text-weight-bold"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuasar, exportFile } from 'quasar'

const $q = useQuasar()

// --- UI State ---
const showDialog = ref(false)
const loading = ref(false)
const isTableLoading = ref(true) // For API readiness
const searchQuery = ref('')
const typeFilter = ref('All')

// --- Table Configuration ---
const accCols = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'desc', label: 'Description', field: 'desc', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'center', sortable: true },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

// --- Data State ---
const accounts = ref([])

const form = reactive({
  type: 'Income',
  date: new Date().toISOString().split('T')[0],
  desc: '',
  amount: ''
})

const LOCAL_STORAGE_KEY = 'house_rent_ledger'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchTransactions()
})

// Simulates an API call to fetch data on page load
const fetchTransactions = () => {
  isTableLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/ledger')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      accounts.value = JSON.parse(savedData)
    } else {
      accounts.value = [
        { id: 1, date: '2026-04-01', desc: 'Rent Received - A-101', type: 'Income', amount: 15000 },
        { id: 2, date: '2026-04-02', desc: 'Plumbing Repair - B-Block', type: 'Expense', amount: 2500 }
      ]
    }
    isTableLoading.value = false
  }, 600) // Simulated network delay
}

// Watcher to auto-save to local storage (acts as a mock database)
watch(accounts, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })


// --- Computed Financial Summaries ---
const totalIncome = computed(() => {
  return accounts.value
    .filter(acc => acc.type === 'Income')
    .reduce((sum, acc) => sum + Number(acc.amount), 0)
})

const totalExpense = computed(() => {
  return accounts.value
    .filter(acc => acc.type === 'Expense')
    .reduce((sum, acc) => sum + Number(acc.amount), 0)
})

const netBalance = computed(() => {
  return totalIncome.value - totalExpense.value
})

// --- Computed Filters ---
const filteredAccounts = computed(() => {
  let result = accounts.value

  if (typeFilter.value !== 'All') {
    result = result.filter(acc => acc.type === typeFilter.value)
  }

  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    result = result.filter(acc =>
      acc.desc.toLowerCase().includes(lowerQuery) ||
      acc.date.includes(lowerQuery)
    )
  }

  // Sort by date newest first
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// --- Methods ---
const openAddDialog = () => {
  form.type = 'Income'
  form.date = new Date().toISOString().split('T')[0]
  form.desc = ''
  form.amount = ''
  showDialog.value = true
}

const saveTransaction = () => {
  loading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.post('/api/ledger', form)
  setTimeout(() => {
    accounts.value.unshift({
      id: Date.now(),
      date: form.date,
      desc: form.desc,
      type: form.type,
      amount: Number(form.amount)
    })

    $q.notify({
      type: 'positive',
      message: 'Transaction recorded successfully!',
      position: 'top-right'
    })

    loading.value = false
    showDialog.value = false
  }, 800)
}

const deleteRecord = (id) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this record?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // INTEGRATION POINT: axios.delete(`/api/ledger/${id}`)
    accounts.value = accounts.value.filter(acc => acc.id !== id)
    $q.notify({ type: 'info', message: 'Record deleted.', position: 'top-right' })
  })
}

// User's original working CSV Export Function
const exportCSV = () => {
  // Exclude 'actions' column from export
  const exportCols = accCols.filter(c => c.name !== 'actions')
  const content = [exportCols.map(col => col.label)]

  filteredAccounts.value.forEach(row => {
    content.push([
      row.date,
      `"${row.desc}"`,
      row.type,
      row.amount
    ])
  })

  const csvString = content.map(row => row.join(',')).join('\r\n')

  const status = exportFile(
    `Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`,
    csvString,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning',
      position: 'top-right'
    })
  } else {
    $q.notify({
      message: 'File downloaded successfully',
      color: 'positive',
      icon: 'check',
      position: 'top-right'
    })
  }
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
</style>
