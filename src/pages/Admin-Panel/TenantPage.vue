<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Tenant Directory</div>
        <div class="text-subtitle1 text-grey-7">Manage renters and send bulk communications</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn 
          outline 
          color="indigo-9" 
          icon="mail" 
          label="Bulk Email" 
          size="md"
          @click="handleBulkEmail" 
        />
        <q-btn 
          color="indigo-9" 
          icon="person_add" 
          label="New Entry" 
          size="md"
          unelevated 
          @click="openAddDialog" 
        />
      </div>
    </div>

    <q-card flat bordered class="shadow-2">
      <q-table
        :rows="tenants"
        :columns="columns"
        row-key="id"
        flat
        selection="multiple"
        v-model:selected="selectedTenants"
        :filter="searchQuery"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="searchQuery" placeholder="Search Tenant...">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              :color="props.value === 'Active' ? 'positive' : 'grey-6'" 
              text-color="white" 
              size="sm"
              class="text-bold"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right" class="q-gutter-x-sm">
            <q-btn flat round color="indigo-9" icon="visibility" size="sm" @click="viewDetails(props.row)">
              <q-tooltip>View Profile</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="person_remove" size="sm" @click="confirmDelete(props.row)">
              <q-tooltip>Remove Tenant</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="width: 550px; max-width: 80vw;">
        <q-card-section class="row items-center bg-indigo-9 text-white q-pb-md">
          <div class="text-h6">Register New Entry</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit.prevent="saveTenant" class="q-gutter-md">
            
            <q-input 
              v-model="tenantForm.name" 
              label="Full Name *" 
              outlined 
              dense 
              :rules="[val => !!val || 'Name is required']"
            >
              <template v-slot:prepend><q-icon name="person" /></template>
            </q-input>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="tenantForm.phone" 
                  label="Phone Number *" 
                  type="tel"
                  mask="###########"
                  outlined 
                  dense 
                  :rules="[val => !!val || 'Phone number is required']"
                >
                  <template v-slot:prepend><q-icon name="phone" /></template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="tenantForm.email" 
                  label="Email Address" 
                  type="email"
                  outlined 
                  dense 
                >
                  <template v-slot:prepend><q-icon name="email" /></template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select 
                  v-model="tenantForm.unit" 
                  :options="['A-101', 'A-102', 'B-205', 'C-301']" 
                  label="Assign Unit *" 
                  outlined 
                  dense 
                  :rules="[val => !!val || 'Unit selection is required']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="tenantForm.advance" 
                  label="Advance/Deposit (৳)" 
                  type="number" 
                  outlined 
                  dense 
                />
              </div>
            </div>

            <q-select 
              v-model="tenantForm.status" 
              :options="['Active', 'Left']" 
              label="Status" 
              outlined 
              dense 
            />

            <div class="row justify-end q-mt-xl q-gutter-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup />
              <q-btn label="Save Entry" color="indigo-9" type="submit" unelevated :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- UI State ---
const searchQuery = ref('')
const showAddDialog = ref(false)
const loading = ref(false)
const selectedTenants = ref([]) // Holds checked rows

// --- Table Configuration ---
const columns = [
  { name: 'name', label: 'Tenant Name', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: 'Contact Number', field: 'phone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'unit', label: 'Assigned Unit', field: 'unit', align: 'left', sortable: true },
  { name: 'joinDate', label: 'Join Date', field: 'joinDate', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

// --- Data State ---
const tenants = ref([])

const tenantForm = reactive({
  name: '',
  phone: '',
  email: '',
  unit: null,
  advance: '',
  status: 'Active'
})

// --- LOCAL STORAGE LOGIC ---
const LOCAL_STORAGE_KEY = 'house_rent_tenants'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    tenants.value = JSON.parse(savedData)
  } else {
    // Default dummy data
    tenants.value = [
      { id: 1, name: 'Kazi Emran', phone: '01959609090', email: 'emran@example.com', unit: 'A-101', joinDate: '2026-04-10', status: 'Active' },
      { id: 2, name: 'Arif Ahmed', phone: '01711223344', email: 'arif@test.com', unit: 'B-205', joinDate: '2026-02-15', status: 'Active' }
    ]
  }
})

watch(tenants, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })


// --- Methods ---

// 1. Bulk Email Logic
const handleBulkEmail = () => {
  if (selectedTenants.value.length === 0) {
    $q.notify({
      type: 'warning',
      message: 'Please select at least one tenant using the checkboxes.',
      position: 'top'
    })
    return
  }

  // Extract emails, filter out empty ones, and join with commas
  const emails = selectedTenants.value
    .map(tenant => tenant.email)
    .filter(email => email && email.trim() !== '')
    .join(',')

  if (!emails) {
    $q.notify({
      type: 'negative',
      message: 'None of the selected tenants have an email address.',
      position: 'top'
    })
    return
  }

  // Open the native email client (Outlook, Gmail, etc.)
  // Using BCC so tenants don't see each other's emails
  const subject = encodeURIComponent('Important Notice from Building Management')
  window.location.href = `mailto:?bcc=${emails}&subject=${subject}`

  // Clear selection after triggering email
  selectedTenants.value = []
}

// 2. Open Add Dialog
const openAddDialog = () => {
  tenantForm.name = ''
  tenantForm.phone = ''
  tenantForm.email = ''
  tenantForm.unit = null
  tenantForm.advance = ''
  tenantForm.status = 'Active'
  showAddDialog.value = true
}

// 3. Save New Entry
const saveTenant = () => {
  loading.value = true

  // INTEGRATION POINT: 
  // axios.post('/api/tenants', tenantForm).then(res => { ... })

  setTimeout(() => {
    const today = new Date().toISOString().split('T')[0]

    tenants.value.unshift({
      id: Date.now(),
      name: tenantForm.name,
      phone: tenantForm.phone,
      email: tenantForm.email,
      unit: tenantForm.unit,
      joinDate: today,
      status: tenantForm.status
    })

    loading.value = false
    showAddDialog.value = false

    $q.notify({
      type: 'positive',
      message: `${tenantForm.name} added successfully!`,
      position: 'top'
    })
  }, 800)
}

// 4. Remove Entry
const confirmDelete = (row) => {
  $q.dialog({
    title: 'Confirm Removal',
    message: `Are you sure you want to remove ${row.name}?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Yes, Remove' },
    cancel: { flat: true, color: 'grey-8' }
  }).onOk(() => {
    
    // INTEGRATION POINT:
    // axios.delete(`/api/tenants/${row.id}`).then(...)
    
    tenants.value = tenants.value.filter(t => t.id !== row.id)
    
    // Also remove from selected array if they were checked
    selectedTenants.value = selectedTenants.value.filter(t => t.id !== row.id)
    
    $q.notify({
      type: 'warning',
      message: 'Tenant removed from the system.',
      icon: 'delete',
      position: 'top'
    })
  })
}

// 5. Placeholder for viewing profile
const viewDetails = (row) => {
  $q.notify({
    type: 'info',
    message: `Profile page for ${row.name} is under development.`,
    position: 'top'
  })
}
</script>