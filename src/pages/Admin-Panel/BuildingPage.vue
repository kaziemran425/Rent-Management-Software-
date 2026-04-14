<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Property Management</div>
        <div class="text-subtitle1 text-grey-7">Manage your buildings and monitor occupancy</div>
      </div>
      <q-btn 
        color="indigo-9" 
        icon="add_business" 
        label="Add New Building" 
        size="md"
        unelevated 
        @click="openAddDialog"
      />
    </div>

    <div v-if="buildings.length === 0" class="flex flex-center q-pa-xl text-grey-6 text-center">
      <div>
        <q-icon name="domain_disabled" size="100px" />
        <div class="text-h6 q-mt-md">No buildings found</div>
        <div>Click "Add New Building" to get started.</div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-4" v-for="building in buildings" :key="building.id">
        <q-card flat bordered class="shadow-2 building-card">
          <q-img :src="building.image || 'https://cdn.quasar.dev/img/parallax2.jpg'" :ratio="16/9">
            <div class="absolute-bottom text-subtitle2 text-center" style="background: rgba(0,0,0,0.6)">
              {{ building.totalUnits }} Total Units
            </div>
          </q-img>
          
          <q-card-section>
            <div class="text-h6 text-bold text-indigo-9">{{ building.name }}</div>
            <div class="text-caption text-grey-7 row items-center q-mt-xs">
              <q-icon name="location_on" size="xs" class="q-mr-xs" />
              {{ building.location }}
            </div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section class="row justify-around text-center bg-grey-1">
            <div class="col">
              <div class="text-h6 text-bold text-positive">{{ building.occupiedUnits }}</div>
              <div class="text-caption text-grey-8 text-uppercase text-weight-bold">Occupied</div>
            </div>
            <q-separator vertical />
            <div class="col">
              <div class="text-h6 text-bold text-orange-9">
                {{ building.totalUnits - building.occupiedUnits }}
              </div>
              <div class="text-caption text-grey-8 text-uppercase text-weight-bold">Vacant</div>
            </div>
          </q-card-section>
          
          <q-separator />

          <q-card-actions align="right" class="q-px-md q-py-sm">
            <q-btn flat color="indigo-9" icon="apartment" label="Manage Units" to="/Admin/flats" />
            <q-space />
            <q-btn flat round color="primary" icon="edit" size="sm" @click="openEditDialog(building)">
              <q-tooltip>Edit Building</q-tooltip>
            </q-btn>
            <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(building)">
              <q-tooltip>Remove Building</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 550px; max-width: 90vw;">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Building' : 'Register New Building' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveBuilding" class="q-gutter-y-md">
            
            <q-select 
              v-model="form.name" 
              label="Building Name *" 
              :options="buildingNameOptions"
              outlined 
              dense 
              emit-value
              map-options
              :rules="[val => !!val || 'Building name is required']"
            >
              <template v-slot:prepend><q-icon name="business" /></template>
            </q-select>

            <q-input 
              v-model="form.location" 
              label="Location/Address *" 
              placeholder="e.g., Mirpur, Shaoraparha"
              outlined 
              dense 
              :rules="[val => !!val || 'Location is required']"
            >
              <template v-slot:prepend><q-icon name="place" /></template>
            </q-input>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select 
                  v-model="form.totalUnits" 
                  label="Total Units *" 
                  :options="totalUnitsOptions"
                  outlined 
                  dense 
                  :rules="[val => !!val || 'Total units required']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input 
                  v-model="form.occupiedUnits" 
                  label="Occupied Units" 
                  type="number" 
                  outlined 
                  dense 
                />
              </div>
            </div>

            <q-file 
              v-model="imageFile" 
              label="Upload Building Image (Optional)" 
              outlined 
              dense 
              accept="image/*"
              @update:model-value="handleImageUpload"
            >
              <template v-slot:prepend><q-icon name="cloud_upload" /></template>
            </q-file>

            <div class="row justify-end q-mt-xl q-gutter-x-md">
              <q-btn label="CANCEL" color="grey-8" flat v-close-popup class="text-bold" />
              <q-btn 
                :label="isEditing ? 'UPDATE BUILDING' : 'SAVE BUILDING'" 
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

// --- UI State ---
const showDialog = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)
const imageFile = ref(null) // State for the file uploader

// --- Options for Q-Select ---
const buildingNameOptions = [
  'Green Valley Residency', 
  'Skyline Tower', 
  'Ocean View Apartment', 
  'Rose Garden Complex',
  'Elite Plaza'
]

const totalUnitsOptions = [5, 10, 15, 20, 24, 30, 40, 50, 100]

// --- Data State ---
const buildings = ref([])

const form = reactive({
  name: '',
  location: '',
  totalUnits: null,
  occupiedUnits: 0,
  image: '' // Will store the base64 string of the image
})

const LOCAL_STORAGE_KEY = 'house_rent_buildings'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    buildings.value = JSON.parse(savedData)
  } else {
    buildings.value = [
      { 
        id: 1, 
        name: 'Green Valley Residency', 
        location: 'Mirpur, Shaoraparha', 
        totalUnits: 24, 
        occupiedUnits: 22,
        image: ''
      }
    ]
  }
})

watch(buildings, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// Image Upload Handler (Converts file to Base64 for LocalStorage)
const handleImageUpload = (file) => {
  if (!file) {
    form.image = ''
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.image = e.target.result // Saves the base64 image data
  }
  reader.readAsDataURL(file)
}

const resetForm = () => {
  form.name = ''
  form.location = ''
  form.totalUnits = null
  form.occupiedUnits = 0
  form.image = ''
  imageFile.value = null
  isEditing.value = false
  editingId.value = null
}

const openAddDialog = () => {
  resetForm()
  showDialog.value = true
}

const openEditDialog = (building) => {
  resetForm()
  isEditing.value = true
  editingId.value = building.id
  form.name = building.name
  form.location = building.location
  form.totalUnits = building.totalUnits
  form.occupiedUnits = building.occupiedUnits
  form.image = building.image
  showDialog.value = true
}

const saveBuilding = () => {
  loading.value = true
  setTimeout(() => {
    if (isEditing.value) {
      const index = buildings.value.findIndex(b => b.id === editingId.value)
      if (index !== -1) {
        buildings.value[index] = { ...buildings.value[index], ...form }
      }
      $q.notify({ type: 'positive', message: 'Building updated successfully!', position: 'top' })
    } else {
      buildings.value.unshift({
        id: Date.now(),
        ...form
      })
      $q.notify({ type: 'positive', message: 'New building added successfully!', position: 'top' })
    }
    loading.value = false
    showDialog.value = false
  }, 600)
}

const confirmDelete = (building) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to remove "${building.name}"?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Yes, Delete' },
    cancel: { flat: true, color: 'grey-8' }
  }).onOk(() => {
    buildings.value = buildings.value.filter(b => b.id !== building.id)
    $q.notify({ type: 'warning', message: 'Building removed.', icon: 'delete', position: 'top' })
  })
}
</script>

<style scoped>
.building-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.building-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
</style>