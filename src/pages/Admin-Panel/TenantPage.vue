<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Tenant Directory</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage renters, track statuses, and send bulk communications</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="mail"
          label="Bulk Email"
          class="text-weight-bold bg-white"
          padding="8px 16px"
          @click="handleBulkEmail"
        >
          <q-tooltip>Email selected tenants</q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon="person_add"
          label="New Tenant"
          unelevated
          class="text-weight-bold shadow-2"
          padding="8px 16px"
          @click="openAddDialog"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Tenants</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-sm">{{ totalTenants }}</div>
            </div>
            <q-avatar size="50px" color="grey-2" text-color="dark" icon="people" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Active Leases</div>
              <div class="text-h4 text-weight-bolder text-positive q-mt-sm">{{ activeTenants }}</div>
            </div>
            <q-avatar size="50px" color="green-1" text-color="positive" icon="how_to_reg" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Moved Out</div>
              <div class="text-h4 text-weight-bolder text-grey-6 q-mt-sm">{{ leftTenants }}</div>
            </div>
            <q-avatar size="50px" color="grey-2" text-color="grey-7" icon="directions_run" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">New This Month</div>
              <div class="text-h4 text-weight-bolder text-primary q-mt-sm">{{ newTenants }}</div>
            </div>
            <q-avatar size="50px" color="blue-1" text-color="primary" icon="fiber_new" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders">
      <q-table
        :rows="tenants"
        :columns="columns"
        row-key="id"
        flat
        selection="multiple"
        v-model:selected="selectedTenants"
        :filter="searchQuery"
        :loading="isTableLoading"
        :pagination="{ rowsPerPage: 10 }"
        table-header-class="bg-grey-2 text-dark text-weight-bold"
      >
        <template v-slot:top>
          <div class="text-h6 text-weight-bold text-dark col">Tenant Roster</div>
          <q-space />
          <div class="row q-gutter-sm items-center">
            <q-select
              v-model="statusFilter"
              :options="['All', 'Active', 'Left']"
              outlined
              dense
              bg-color="white"
              options-dense
              style="min-width: 120px"
            />
            <q-input outlined dense debounce="300" v-model="searchQuery" placeholder="Search Tenant..." bg-color="white">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'Active' ? 'positive' : 'grey-6'"
              class="text-weight-bold q-pa-xs q-px-sm"
              rounded
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right" class="q-gutter-sm">
            <q-btn flat round dense color="info" icon="visibility" @click="viewDetails(props.row)">
              <q-tooltip>View Profile</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="primary" icon="edit" @click="openEditDialog(props.row)">
              <q-tooltip>Edit Details</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="person_remove" @click="confirmDelete(props.row)">
              <q-tooltip>Remove Tenant</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showProfileDialog">
      <q-card style="width: 600px; max-width: 90vw; border-radius: 12px; overflow: hidden;">
        <div class="bg-primary text-white q-pa-xl text-center relative-position">
          <q-btn icon="close" flat round dense v-close-popup class="absolute-top-right q-ma-sm" />
          <q-avatar size="100px" class="shadow-5 bg-white q-mb-md">
            <img :src="`https://ui-avatars.com/api/?name=${selectedTenant?.name}&background=random&color=fff&size=100`">
          </q-avatar>
          <div class="text-h5 text-weight-bold">{{ selectedTenant?.name }}</div>
          <div class="text-subtitle1 opacity-80">{{ selectedTenant?.email || 'No email provided' }}</div>

          <q-badge
            :color="selectedTenant?.status === 'Active' ? 'positive' : 'grey-8'"
            class="q-mt-sm text-weight-bold q-px-sm q-py-xs shadow-2"
          >
            {{ selectedTenant?.status }} Tenant
          </q-badge>
        </div>

        <q-card-section class="q-pa-md">
          <div class="row justify-center q-gutter-md q-mb-lg">
            <q-btn outline color="primary" icon="phone" label="Call" :href="`tel:${selectedTenant?.phone}`" />
            <q-btn outline color="primary" icon="email" label="Email" :disable="!selectedTenant?.email" :href="`mailto:${selectedTenant?.email}`" />
            <q-btn outline color="primary" icon="chat" label="Message" to="/admin/messages" />
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-card flat bordered class="bg-grey-1 fit">
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-sm">Contact Information</div>
                  <q-list dense>
                    <q-item class="q-px-none">
                      <q-item-section avatar><q-icon name="phone" color="grey-6" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Phone Number</q-item-label>
                        <q-item-label class="text-weight-bold text-dark">{{ selectedTenant?.phone }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section avatar><q-icon name="email" color="grey-6" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Email Address</q-item-label>
                        <q-item-label class="text-weight-bold text-dark">{{ selectedTenant?.email || 'N/A' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-sm-6">
              <q-card flat bordered class="bg-grey-1 fit">
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold q-mb-sm">Lease Details</div>
                  <q-list dense>
                    <q-item class="q-px-none">
                      <q-item-section avatar><q-icon name="meeting_room" color="grey-6" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Assigned Unit</q-item-label>
                        <q-item-label class="text-weight-bold text-primary">{{ selectedTenant?.unit }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section avatar><q-icon name="event" color="grey-6" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Move-in Date</q-item-label>
                        <q-item-label class="text-weight-bold text-dark">{{ selectedTenant?.joinDate }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-px-none">
                      <q-item-section avatar><q-icon name="account_balance_wallet" color="grey-6" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Security Deposit</q-item-label>
                        <q-item-label class="text-weight-bold text-dark">৳ {{ selectedTenant?.advance ? Number(selectedTenant.advance).toLocaleString() : '0' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="bg-grey-2 q-pa-md">
          <q-btn flat color="primary" icon="edit" label="Edit Profile" @click="editFromProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 550px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Tenant Details' : 'Register New Tenant' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveTenant" class="q-gutter-y-md">

            <q-input
              v-model="tenantForm.name"
              label="Full Name *"
              outlined
              dense
              :rules="[val => !!val || 'Name is required']"
            >
              <template v-slot:prepend><q-icon name="person" color="grey-7" /></template>
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
                  <template v-slot:prepend><q-icon name="phone" color="grey-7" /></template>
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
                  <template v-slot:prepend><q-icon name="email" color="grey-7" /></template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="tenantForm.unit"
                  :options="unitOptions"
                  label="Assign Unit *"
                  outlined
                  dense
                  options-dense
                  :rules="[val => !!val || 'Unit selection is required']"
                >
                  <template v-slot:prepend><q-icon name="meeting_room" color="grey-7" /></template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="tenantForm.advance"
                  label="Advance/Deposit (৳)"
                  type="number"
                  outlined
                  dense
                >
                  <template v-slot:prepend><q-icon name="payments" color="grey-7" /></template>
                </q-input>
              </div>
            </div>

            <q-select
              v-model="tenantForm.status"
              :options="['Active', 'Left']"
              label="Current Status"
              outlined
              dense
            >
              <template v-slot:prepend><q-icon name="info" color="grey-7" /></template>
            </q-select>

            <div class="row justify-end q-mt-xl q-gutter-x-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
              <q-btn
                :label="isEditing ? 'Update Tenant' : 'Save Entry'"
                color="primary"
                type="submit"
                unelevated
                class="text-weight-bold"
                :loading="isSubmitting"
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
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- UI State ---
const searchQuery = ref('')
const statusFilter = ref('All')

const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const showProfileDialog = ref(false) // State for Profile Viewer
const selectedTenant = ref(null)     // Holds data for Profile Viewer

const isTableLoading = ref(true)
const isSubmitting = ref(false)
const selectedTenants = ref([])

// --- Options Arrays ---
const unitOptions = ['A-101', 'A-102', 'B-205', 'C-301']

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

const LOCAL_STORAGE_KEY = 'house_rent_tenants'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchTenants()
})

const fetchTenants = () => {
  isTableLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenants')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      tenants.value = JSON.parse(savedData)
    } else {
      // Default dummy data
      tenants.value = [
        { id: 1, name: 'Alice Johnson', phone: '01959609090', email: 'alice@example.com', unit: 'A-101', joinDate: '2026-04-10', status: 'Active', advance: 15000 },
        { id: 2, name: 'Arif Ahmed', phone: '01711223344', email: 'arif@test.com', unit: 'B-205', joinDate: '2026-02-15', status: 'Active', advance: 18000 },
        { id: 3, name: 'Charlie Brown', phone: '01811223355', email: '', unit: 'A-102', joinDate: '2025-11-01', status: 'Left', advance: 12000 }
      ]
    }
    isTableLoading.value = false
  }, 600)
}

watch(tenants, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// --- Computed KPIs ---
const totalTenants = computed(() => tenants.value.length)
const activeTenants = computed(() => tenants.value.filter(t => t.status === 'Active').length)
const leftTenants = computed(() => tenants.value.filter(t => t.status === 'Left').length)
const newTenants = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  return tenants.value.filter(t => t.joinDate.startsWith(currentMonth)).length
})

// --- Computed Filters ---
const filteredTenants = computed(() => {
  let result = tenants.value
  if (statusFilter.value !== 'All') {
    result = result.filter(t => t.status === statusFilter.value)
  }
  return result
})

// --- Methods ---

const handleBulkEmail = () => {
  if (selectedTenants.value.length === 0) {
    $q.notify({ type: 'warning', message: 'Please select at least one tenant using the checkboxes.', position: 'top-right' })
    return
  }

  const emails = selectedTenants.value
    .map(tenant => tenant.email)
    .filter(email => email && email.trim() !== '')
    .join(',')

  if (!emails) {
    $q.notify({ type: 'negative', message: 'None of the selected tenants have an email address.', position: 'top-right' })
    return
  }

  const subject = encodeURIComponent('Important Notice from Building Management')
  window.location.href = `mailto:?bcc=${emails}&subject=${subject}`

  selectedTenants.value = [] // Clear selection
}

// Opens the beautifully designed Profile View
const viewDetails = (row) => {
  selectedTenant.value = row
  showProfileDialog.value = true
}

// Allows jumping straight to Edit mode from the Profile Viewer
const editFromProfile = () => {
  showProfileDialog.value = false
  openEditDialog(selectedTenant.value)
}

const resetForm = () => {
  tenantForm.name = ''
  tenantForm.phone = ''
  tenantForm.email = ''
  tenantForm.unit = null
  tenantForm.advance = ''
  tenantForm.status = 'Active'
  isEditing.value = false
  editingId.value = null
}

const openAddDialog = () => {
  resetForm()
  showDialog.value = true
}

const openEditDialog = (row) => {
  resetForm()
  isEditing.value = true
  editingId.value = row.id

  // Populate form
  tenantForm.name = row.name
  tenantForm.phone = row.phone
  tenantForm.email = row.email
  tenantForm.unit = row.unit
  tenantForm.advance = row.advance
  tenantForm.status = row.status

  showDialog.value = true
}

const saveTenant = () => {
  isSubmitting.value = true

  setTimeout(() => {
    if (isEditing.value) {
      // INTEGRATION POINT: axios.put(`/api/tenants/${editingId.value}`, tenantForm)
      const index = tenants.value.findIndex(t => t.id === editingId.value)
      if (index !== -1) {
        tenants.value[index] = { ...tenants.value[index], ...tenantForm }
      }
      $q.notify({ type: 'positive', message: 'Tenant details updated!', position: 'top-right' })
    } else {
      // INTEGRATION POINT: axios.post('/api/tenants', tenantForm)
      const today = new Date().toISOString().split('T')[0]
      tenants.value.unshift({
        id: Date.now(),
        ...tenantForm,
        joinDate: today
      })
      $q.notify({ type: 'positive', message: 'New tenant added successfully!', position: 'top-right' })
    }

    isSubmitting.value = false
    showDialog.value = false
  }, 600)
}

const confirmDelete = (row) => {
  $q.dialog({
    title: 'Confirm Removal',
    message: `Are you sure you want to remove ${row.name}?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Remove', unelevated: true },
    cancel: { flat: true, color: 'grey-8', label: 'Cancel' }
  }).onOk(() => {
    // INTEGRATION POINT: axios.delete(`/api/tenants/${row.id}`)
    tenants.value = tenants.value.filter(t => t.id !== row.id)
    selectedTenants.value = selectedTenants.value.filter(t => t.id !== row.id)
    $q.notify({ type: 'info', message: 'Tenant removed from the directory.', position: 'top-right' })
  })
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
