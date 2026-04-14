<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Financial Ledger</div>
        <div class="text-subtitle1 text-grey-7">Track all income and expenses across your properties</div>
      </div>
      <q-btn 
        color="indigo-9" 
        icon="add_circle" 
        label="Add Transaction" 
        size="md"
        unelevated 
        @click="openAddDialog"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">Total Income</div>
            <div class="text-h4 text-bold text-positive q-mt-sm">৳ {{ totalIncome.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">Total Expenses</div>
            <div class="text-h4 text-bold text-negative q-mt-sm">৳ {{ totalExpense.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-indigo-9 text-white">
          <q-card-section>
            <div class="text-subtitle2 text-indigo-2 text-uppercase text-bold">Net Balance</div>
            <div class="text-h4 text-bold q-mt-sm">৳ {{ netBalance.toLocaleString() }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-2">
      <q-table
        title="Transaction History"
        :rows="filteredAccounts"
        :columns="accCols"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 15 }"
      >
        <template v-slot:top-right>
          <div class="row q-gutter-sm items-center">
            <q-select 
              v-model="typeFilter" 
              :options="['All', 'Income', 'Expense']" 
              outlined 
              dense 
              options-dense
              style="min-width: 120px"
            />
            <q-input borderless dense debounce="300" v-model="searchQuery" placeholder="Search records...">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
            <q-btn 
              color="indigo-9" 
              icon="file_download" 
              label="Export CSV" 
              outline 
              @click="exportCSV" 
            />
          </div>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge 
              :color="props.value === 'Income' ? 'positive' : 'negative'"
              class="text-bold q-pa-xs"
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 450px; max-width: 80vw;">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-md">
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
                <q-icon :name="form.type === 'Income' ? 'arrow_downward' : 'arrow_upward'" 
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
              <template v-slot:prepend><q-icon name="description" /></template>
            </q-input>

            <q-input 
              v-model.number="form.amount" 
              label="Amount (৳) *" 
              type="number" 
              outlined 
              dense 
              :rules="[val => !!val || 'Amount is required']"
            >
              <template v-slot:prepend><q-icon name="payments" /></template>
            </q-input>

            <div class="row justify-end q-mt-xl q-gutter-x-md">
              <q-btn label="CANCEL" color="grey-8" flat v-close-popup class="text-bold" />
              <q-btn 
                label="SAVE RECORD" 
                color="indigo-9" 
                type="submit" 
                unelevated 
                class="text-bold"
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
const searchQuery = ref('')
const typeFilter = ref('All')

// --- Table Configuration ---
const accCols = [
  { name: 'date', label: 'Transaction Date', field: 'date', align: 'left', sortable: true },
  { name: 'desc', label: 'Description', field: 'desc', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'center', sortable: true },
  { 
    name: 'amount', 
    label: 'Amount', 
    field: 'amount', 
    align: 'right', 
    sortable: true,
    // Format the number to look like currency in the table
    format: val => `৳ ${Number(val).toLocaleString()}` 
  }
]

// --- Data State ---
const accounts = ref([])

const form = reactive({
  type: 'Income',
  date: new Date().toISOString().split('T')[0], // Defaults to today
  desc: '',
  amount: ''
})

// --- LOCAL STORAGE LOGIC ---
const LOCAL_STORAGE_KEY = 'house_rent_ledger'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    accounts.value = JSON.parse(savedData)
  } else {
    // Note: Storing amounts as numbers makes math calculations easier
    accounts.value = [
      { id: 1, date: '2026-04-01', desc: 'Rent Received - A-101', type: 'Income', amount: 15000 },
      { id: 2, date: '2026-04-02', desc: 'Plumbing Repair - B-Block', type: 'Expense', amount: 2500 }
    ]
  }
})

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

  // Apply Type Filter
  if (typeFilter.value !== 'All') {
    result = result.filter(acc => acc.type === typeFilter.value)
  }

  // Apply Search Query
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    result = result.filter(acc => 
      acc.desc.toLowerCase().includes(lowerQuery) || 
      acc.date.includes(lowerQuery)
    )
  }

  return result
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

  setTimeout(() => {
    // INTEGRATION POINT: axios.post('/api/ledger', form).then(...)
    
    accounts.value.unshift({
      id: Date.now(),
      date: form.date,
      desc: form.desc,
      type: form.type,
      amount: Number(form.amount) // Ensure it's stored as a number
    })

    $q.notify({ 
      type: 'positive', 
      message: 'Transaction recorded successfully!', 
      position: 'top' 
    })
    
    loading.value = false
    showDialog.value = false
  }, 500)
}

// Working CSV Export Function
const exportCSV = () => {
  // Extract headers
  const content = [accCols.map(col => col.label)]
  
  // Extract data rows
  filteredAccounts.value.forEach(row => {
    content.push([
      row.date,
      `"${row.desc}"`, // Wrap in quotes in case description has commas
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
      icon: 'warning'
    })
  } else {
    $q.notify({
      message: 'File downloaded successfully',
      color: 'positive',
      icon: 'check'
    })
  }
}
</script>