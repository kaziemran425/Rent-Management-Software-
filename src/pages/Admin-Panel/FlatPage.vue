<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Unit Inventory Management</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage your flats, current status, and rent details</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add New Unit"
        unelevated
        class="text-weight-bold shadow-2"
        padding="8px 16px"
        @click="openAddDialog"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Units</div>
              <div class="text-h4 text-weight-bolder text-dark q-mt-sm">{{ totalFlats }}</div>
            </div>
            <q-avatar size="50px" color="grey-2" text-color="dark" icon="apartment" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Occupied</div>
              <div class="text-h4 text-weight-bolder text-primary q-mt-sm">{{ occupiedFlats }}</div>
            </div>
            <q-avatar size="50px" color="blue-1" text-color="primary" icon="vpn_key" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Vacant</div>
              <div class="text-h4 text-weight-bolder text-positive q-mt-sm">{{ vacantFlats }}</div>
            </div>
            <q-avatar size="50px" color="green-1" text-color="positive" icon="check_circle" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="shadow-1 rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Maintenance</div>
              <div class="text-h4 text-weight-bolder text-warning q-mt-sm">{{ maintenanceFlats }}</div>
            </div>
            <q-avatar size="50px" color="orange-1" text-color="warning" icon="engineering" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders">
      <q-table
        :rows="filteredFlats"
        :columns="columns"
        row-key="id"
        flat
        :loading="isTableLoading"
        :pagination="{ rowsPerPage: 10 }"
        table-header-class="bg-grey-2 text-dark text-weight-bold"
      >
        <template v-slot:top>
          <div class="text-h6 text-weight-bold text-dark col">Unit Directory</div>
          <q-space />
          <div class="row q-gutter-sm items-center">
            <q-select
              v-model="statusFilter"
              :options="['All', 'Vacant', 'Occupied', 'Maintenance']"
              outlined
              dense
              bg-color="white"
              options-dense
              style="min-width: 140px"
            />
            <q-input outlined dense debounce="300" v-model="searchQuery" placeholder="Search Unit..." bg-color="white">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.value === 'Vacant' ? 'positive' : props.value === 'Maintenance' ? 'warning' : 'primary'"
              class="text-weight-bold q-pa-xs q-px-sm"
              rounded
            >
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-rent="props">
          <q-td :props="props" class="text-weight-bold text-dark">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm" align="right">
            <q-btn flat round dense color="grey-7" icon="edit" @click="openEditDialog(props.row)">
              <q-tooltip>Edit Unit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)">
              <q-tooltip>Remove Unit</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Unit Details' : 'Register New Unit' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveFlat" class="q-gutter-y-md">

            <q-select
              v-model="flatForm.unit"
              :options="unitOptions"
              label="Unit Number *"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Unit number is required']"
            >
              <template v-slot:prepend><q-icon name="meeting_room" color="grey-7" /></template>
            </q-select>

            <q-select
              v-model="flatForm.building"
              :options="availableBuildings"
              label="Select Building *"
              outlined
              dense
              :rules="[val => !!val || 'Building selection is required']"
            >
              <template v-slot:prepend><q-icon name="domain" color="grey-7" /></template>
            </q-select>

            <q-input
              v-model.number="flatForm.rent"
              label="Monthly Rent (৳) *"
              type="number"
              outlined
              dense
              :rules="[val => !!val || 'Rent amount is required']"
            >
              <template v-slot:prepend><q-icon name="payments" color="grey-7" /></template>
            </q-input>

            <q-select
              v-model="flatForm.status"
              :options="['Vacant', 'Occupied', 'Maintenance']"
              label="Current Status"
              outlined
              dense
            >
              <template v-slot:prepend><q-icon name="info" color="grey-7" /></template>
            </q-select>

            <div class="row justify-end q-mt-xl q-gutter-x-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
              <q-btn
                :label="isEditing ? 'Update Unit' : 'Save Unit'"
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
const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isSubmitting = ref(false)
const isTableLoading = ref(true)

// Filtering State
const searchQuery = ref('')
const statusFilter = ref('All')

// --- Options Arrays ---
const availableBuildings = [
  'Green Valley Residency 1',
  'Green Valley Residency 2',
  'Skyline Tower',
  'Ocean View Apartment'
]

const unitOptions = [
  'A-101', 'A-102', 'A-103', 'A-104',
  'B-101', 'B-102', 'B-103', 'B-104',
  'C-101', 'C-102', 'C-103', 'C-104',
  'D-101', 'D-102', 'D-103', 'D-104'
]

// --- Form State ---
const flatForm = reactive({
  unit: '',
  building: null,
  rent: '',
  status: 'Vacant'
})

// --- Table Configuration ---
const columns = [
  { name: 'unit', label: 'Unit No', field: 'unit', align: 'left', sortable: true },
  { name: 'building', label: 'Building', field: 'building', align: 'left', sortable: true },
  {
    name: 'rent',
    label: 'Monthly Rent',
    field: 'rent',
    align: 'center',
    sortable: true,
    format: val => `৳ ${Number(val).toLocaleString()}`
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

// --- Data State & Local Storage ---
const flats = ref([])
const LOCAL_STORAGE_KEY = 'house_rent_flats'

onMounted(() => {
  fetchFlats()
})

const fetchFlats = () => {
  isTableLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/flats')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      flats.value = JSON.parse(savedData)
    } else {
      // Default dummy data
      flats.value = [
        { id: 1, unit: 'A-101', building: 'Green Valley Residency 1', rent: 15000, status: 'Occupied' },
        { id: 2, unit: 'A-102', building: 'Green Valley Residency 1', rent: 12000, status: 'Vacant' },
        { id: 3, unit: 'B-101', building: 'Skyline Tower', rent: 18000, status: 'Maintenance' }
      ]
    }
    isTableLoading.value = false
  }, 600)
}

// Auto-save any changes to Local Storage
watch(flats, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// --- Computed KPIs & Filters ---
const totalFlats = computed(() => flats.value.length)
const occupiedFlats = computed(() => flats.value.filter(f => f.status === 'Occupied').length)
const vacantFlats = computed(() => flats.value.filter(f => f.status === 'Vacant').length)
const maintenanceFlats = computed(() => flats.value.filter(f => f.status === 'Maintenance').length)

const filteredFlats = computed(() => {
  let result = flats.value

  // Filter by Dropdown Status
  if (statusFilter.value !== 'All') {
    result = result.filter(f => f.status === statusFilter.value)
  }

  // Filter by Search Query (Unit Name or Building)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      f.unit.toLowerCase().includes(query) ||
      f.building.toLowerCase().includes(query)
    )
  }

  return result
})

// --- Methods ---

const resetForm = () => {
  flatForm.unit = ''
  flatForm.building = null
  flatForm.rent = ''
  flatForm.status = 'Vacant'
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

  // Populate form with row data
  flatForm.unit = row.unit
  flatForm.building = row.building
  flatForm.rent = row.rent
  flatForm.status = row.status

  showDialog.value = true
}

const saveFlat = () => {
  isSubmitting.value = true

  setTimeout(() => {
    if (isEditing.value) {
      // UPDATE LOGIC (Integration Point: axios.put)
      const index = flats.value.findIndex(f => f.id === editingId.value)
      if (index !== -1) {
        flats.value[index] = { ...flats.value[index], ...flatForm, rent: Number(flatForm.rent) }
      }
      $q.notify({ type: 'positive', message: `Unit ${flatForm.unit} updated!`, position: 'top-right' })
    } else {
      // CREATE LOGIC (Integration Point: axios.post)
      flats.value.unshift({
        id: Date.now(),
        unit: flatForm.unit,
        building: flatForm.building,
        rent: Number(flatForm.rent),
        status: flatForm.status
      })
      $q.notify({ type: 'positive', message: `Unit ${flatForm.unit} added successfully!`, position: 'top-right' })
    }

    isSubmitting.value = false
    showDialog.value = false
  }, 600)
}

const confirmDelete = (row) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to remove Unit ${row.unit}? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Delete', unelevated: true },
    cancel: { flat: true, color: 'grey-8', label: 'Cancel' }
  }).onOk(() => {
    // DELETE LOGIC (Integration Point: axios.delete)
    flats.value = flats.value.filter(flat => flat.id !== row.id)
    $q.notify({ type: 'info', message: `Unit ${row.unit} removed.`, position: 'top-right' })
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
</style>
