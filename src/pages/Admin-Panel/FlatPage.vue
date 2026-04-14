<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Unit Inventory Management</div>
        <div class="text-subtitle1 text-grey-7">Manage your flats, status, and rent details</div>
      </div>
      <q-btn 
        color="indigo-9" 
        icon="add" 
        label="Add New Unit" 
        unelevated 
        @click="openAddDialog" 
      />
    </div>

    <q-card flat bordered class="shadow-2">
      <q-table
        :rows="flats"
        :columns="columns"
        row-key="id"
        flat
        :filter="filter"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search Unit">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip 
              :color="props.value === 'Vacant' ? 'positive' : props.value === 'Maintenance' ? 'orange-9' : 'grey-7'" 
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
            <q-btn 
              flat 
              round 
              color="primary" 
              icon="edit" 
              size="sm" 
              class="q-mr-sm"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>Edit Unit</q-tooltip>
            </q-btn>

            <q-btn 
              flat 
              round 
              color="negative" 
              icon="delete" 
              size="sm" 
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Remove Unit</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Unit Details' : 'Add New Unit' }}</div>
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
            />

            <q-select 
              v-model="flatForm.building" 
              :options="availableBuildings" 
              label="Select Building *" 
              outlined 
              dense 
              :rules="[val => !!val || 'Building selection is required']"
            />

            <q-input 
              v-model.number="flatForm.rent" 
              label="Monthly Rent (৳) *" 
              type="number" 
              outlined 
              dense 
              :rules="[val => !!val || 'Rent amount is required']"
            />

            <q-select 
              v-model="flatForm.status" 
              :options="['Vacant', 'Occupied', 'Maintenance']" 
              label="Current Status" 
              outlined 
              dense 
            />

            <div class="row justify-end q-mt-xl q-gutter-x-md">
              <q-btn label="CANCEL" color="grey-8" flat v-close-popup class="text-bold" />
              <q-btn 
                :label="isEditing ? 'UPDATE UNIT' : 'SAVE UNIT'" 
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const filter = ref('')

// --- UI State ---
const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)

// --- Options Arrays ---
const availableBuildings = [
  'Green Valley Residency 1', 
  'Green Valley Residency 2', 
  'Skyline Tower',
  'Ocean View Apartment'
]

// Common unit configurations for the dropdown
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
    format: val => `৳ ${Number(val).toLocaleString()}` // Formats number to currency automatically
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

// --- Data State & Local Storage ---
const flats = ref([])
const LOCAL_STORAGE_KEY = 'house_rent_flats'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    flats.value = JSON.parse(savedData)
  } else {
    // Default dummy data
    flats.value = [
      { id: 1, unit: 'A-101', building: 'Green Valley Residency 1', rent: 15000, status: 'Occupied' },
      { id: 2, unit: 'A-102', building: 'Green Valley Residency 1', rent: 12000, status: 'Vacant' }
    ]
  }
})

// Auto-save any changes
watch(flats, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

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
  loading.value = true

  setTimeout(() => {
    if (isEditing.value) {
      // UPDATE LOGIC (Integration Point: axios.put)
      const index = flats.value.findIndex(f => f.id === editingId.value)
      if (index !== -1) {
        flats.value[index] = { ...flats.value[index], ...flatForm, rent: Number(flatForm.rent) }
      }
      $q.notify({ type: 'positive', message: `Unit ${flatForm.unit} updated!`, position: 'top' })
    } else {
      // CREATE LOGIC (Integration Point: axios.post)
      flats.value.unshift({
        id: Date.now(),
        unit: flatForm.unit,
        building: flatForm.building,
        rent: Number(flatForm.rent),
        status: flatForm.status
      })
      $q.notify({ type: 'positive', message: `Unit ${flatForm.unit} added successfully!`, position: 'top' })
    }

    loading.value = false
    showDialog.value = false
  }, 500)
}

const confirmDelete = (row) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to remove Unit ${row.unit}? This action cannot be undone.`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Yes, Delete' },
    cancel: { flat: true, color: 'grey-8' }
  }).onOk(() => {
    // DELETE LOGIC (Integration Point: axios.delete)
    flats.value = flats.value.filter(flat => flat.id !== row.id)
    $q.notify({ type: 'warning', message: `Unit ${row.unit} removed.`, icon: 'delete', position: 'top' })
  })
}
</script>