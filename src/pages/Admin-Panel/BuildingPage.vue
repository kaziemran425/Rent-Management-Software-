<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Property Management</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage your buildings, locations, and overall capacity</div>
      </div>
      <q-btn
        color="primary"
        icon="add_business"
        label="Add New Building"
        unelevated
        class="text-weight-bold shadow-2"
        padding="8px 16px"
        @click="openAddDialog"
      />
    </div>

    <div v-if="isPageLoading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else>
      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="shadow-1 rounded-borders bg-primary text-white">
            <q-card-section class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-blue-2 text-uppercase text-weight-bold">Total Buildings</div>
                <div class="text-h3 text-weight-bolder q-mt-sm">{{ totalBuildings }}</div>
              </div>
              <q-avatar size="60px" color="blue-8" text-color="white" icon="domain" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="shadow-1 rounded-borders bg-white">
            <q-card-section class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Capacity (Units)</div>
                <div class="text-h3 text-weight-bolder text-dark q-mt-sm">{{ totalCapacity }}</div>
              </div>
              <q-avatar size="60px" color="grey-2" text-color="dark" icon="meeting_room" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card flat bordered class="shadow-1 rounded-borders bg-white">
            <q-card-section class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Overall Occupancy</div>
                <div class="text-h3 text-weight-bolder text-info q-mt-sm">{{ overallOccupancy }}%</div>
              </div>
              <q-avatar size="60px" color="blue-1" text-color="info" icon="pie_chart" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-if="buildings.length === 0" class="flex flex-center q-pa-xl text-grey-6 text-center bg-white shadow-1 rounded-borders q-mt-md">
        <div>
          <q-icon name="domain_disabled" size="80px" color="grey-4" />
          <div class="text-h5 text-weight-bold q-mt-md text-dark">No buildings found</div>
          <div class="q-mt-sm">Click "Add New Building" to register your first property.</div>
          <q-btn color="primary" outline label="Add Building" class="q-mt-md text-weight-bold" @click="openAddDialog" />
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div class="col-12 col-md-6 col-lg-4" v-for="building in buildings" :key="building.id">
          <q-card flat bordered class="shadow-1 building-card bg-white column fit">

            <q-img
              :src="building.image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
              :ratio="16/9"
              class="image-container"
            >
              <q-badge
                floating
                rounded
                :color="building.occupiedUnits >= building.totalUnits ? 'positive' : 'info'"
                class="q-ma-sm text-weight-bold shadow-1"
                style="top: 8px; right: 8px; padding: 6px 12px;"
              >
                {{ building.occupiedUnits >= building.totalUnits ? 'Fully Occupied' : 'Vacancies Available' }}
              </q-badge>
            </q-img>

            <q-card-section class="col">
              <div class="row justify-between items-start">
                <div class="col-10">
                  <div class="text-h5 text-weight-bolder text-dark line-height-tight">{{ building.name }}</div>
                  <div class="text-caption text-grey-7 row items-center q-mt-xs">
                    <q-icon name="location_on" size="16px" class="q-mr-xs text-primary" />
                    {{ building.location }}
                  </div>
                </div>
              </div>

              <div class="q-mt-lg">
                <div class="row justify-between text-caption text-weight-bold q-mb-xs">
                  <span class="text-grey-8">Occupancy Rate</span>
                  <span :class="occupancyColorText(building)">
                    {{ Math.round((building.occupiedUnits / building.totalUnits) * 100) || 0 }}%
                  </span>
                </div>
                <q-linear-progress
                  rounded
                  size="10px"
                  :value="building.occupiedUnits / building.totalUnits"
                  :color="occupancyColor(building)"
                  track-color="grey-3"
                />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="row justify-around text-center bg-grey-1 q-pa-sm">
              <div class="col">
                <div class="text-h6 text-weight-bolder text-dark">{{ building.totalUnits }}</div>
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 11px;">Total Units</div>
              </div>
              <q-separator vertical />
              <div class="col">
                <div class="text-h6 text-weight-bolder text-positive">{{ building.occupiedUnits }}</div>
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 11px;">Occupied</div>
              </div>
              <q-separator vertical />
              <div class="col">
                <div class="text-h6 text-weight-bolder text-orange-9">{{ building.totalUnits - building.occupiedUnits }}</div>
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold" style="font-size: 11px;">Vacant</div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="between" class="q-px-md q-py-sm bg-white">
              <q-btn outline color="primary" icon="meeting_room" label="Manage Units" size="sm" class="text-weight-bold" to="/admin/flats" />
              <div class="q-gutter-xs">
                <q-btn flat round color="grey-7" icon="edit" size="sm" @click="openEditDialog(building)">
                  <q-tooltip>Edit Building</q-tooltip>
                </q-btn>
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(building)">
                  <q-tooltip>Remove Building</q-tooltip>
                </q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 550px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold">{{ isEditing ? 'Edit Building Details' : 'Register New Building' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveBuilding" class="q-gutter-y-md">

            <q-input
              v-model="form.name"
              label="Building Name *"
              placeholder="e.g., Skyline Tower"
              outlined
              dense
              :rules="[val => !!val || 'Building name is required']"
            >
              <template v-slot:prepend><q-icon name="business" color="grey-7" /></template>
            </q-input>

            <q-input
              v-model="form.location"
              label="Location/Address *"
              placeholder="e.g., Mirpur, Dhaka"
              outlined
              dense
              :rules="[val => !!val || 'Location is required']"
            >
              <template v-slot:prepend><q-icon name="place" color="grey-7" /></template>
            </q-input>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="form.totalUnits"
                  label="Total Units *"
                  type="number"
                  outlined
                  dense
                  :rules="[
                    val => !!val || 'Total units required',
                    val => val > 0 || 'Must be greater than 0'
                  ]"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="form.occupiedUnits"
                  label="Occupied Units"
                  type="number"
                  outlined
                  dense
                  :rules="[
                    val => val >= 0 || 'Cannot be negative',
                    val => val <= form.totalUnits || 'Cannot exceed total units'
                  ]"
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
              <template v-slot:prepend><q-icon name="add_photo_alternate" color="grey-7" /></template>
            </q-file>

            <div class="row justify-end q-mt-xl q-gutter-x-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
              <q-btn
                :label="isEditing ? 'Update Building' : 'Save Building'"
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
const isPageLoading = ref(true)
const imageFile = ref(null)

// --- Data State ---
const buildings = ref([])

const form = reactive({
  name: '',
  location: '',
  totalUnits: null,
  occupiedUnits: 0,
  image: ''
})

// BRIDGE KEY: Using this across other pages (like FlatPage) to reference buildings
const LOCAL_STORAGE_KEY = 'house_rent_buildings'

// --- Lifecycle ---
onMounted(() => {
  fetchBuildings()
})

const fetchBuildings = () => {
  isPageLoading.value = true

  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      buildings.value = JSON.parse(savedData)
    } else {
      // Default Mock Initial Data
      buildings.value = [
        {
          id: 1,
          name: 'Green Valley Residency',
          location: 'Mirpur, Dhaka',
          totalUnits: 24,
          occupiedUnits: 22,
          image: ''
        },
        {
          id: 2,
          name: 'Ocean View Apartment',
          location: 'Gulshan 2, Dhaka',
          totalUnits: 15,
          occupiedUnits: 5,
          image: ''
        }
      ]
    }
    isPageLoading.value = false
  }, 500)
}

// Auto-save to Local Storage
watch(buildings, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// --- Computed KPIs ---
const totalBuildings = computed(() => buildings.value.length)

const totalCapacity = computed(() => {
  return buildings.value.reduce((sum, b) => sum + (Number(b.totalUnits) || 0), 0)
})

const overallOccupancy = computed(() => {
  if (totalCapacity.value === 0) return 0
  const totalOccupied = buildings.value.reduce((sum, b) => sum + (Number(b.occupiedUnits) || 0), 0)
  return Math.round((totalOccupied / totalCapacity.value) * 100)
})

// --- Helper Functions ---
const occupancyColor = (building) => {
  if (!building.totalUnits) return 'grey'
  const ratio = building.occupiedUnits / building.totalUnits
  if (ratio >= 0.9) return 'positive'
  if (ratio >= 0.5) return 'info'
  return 'warning'
}

const occupancyColorText = (building) => {
  if (!building.totalUnits) return 'text-grey'
  const ratio = building.occupiedUnits / building.totalUnits
  if (ratio >= 0.9) return 'text-positive'
  if (ratio >= 0.5) return 'text-info'
  return 'text-warning'
}

// Convert image file to Base64 to save inside Local Storage
const handleImageUpload = (file) => {
  if (!file) {
    form.image = ''
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.image = e.target.result
  }
  reader.readAsDataURL(file)
}

// --- Methods ---
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
  isSubmitting.value = true

  setTimeout(() => {
    if (isEditing.value) {
      const index = buildings.value.findIndex(b => b.id === editingId.value)
      if (index !== -1) {
        buildings.value[index] = { ...buildings.value[index], ...form }
      }
      $q.notify({ type: 'positive', message: 'Building updated successfully!', position: 'top-right' })
    } else {
      buildings.value.unshift({
        id: Date.now(),
        ...form
      })
      $q.notify({ type: 'positive', message: 'New building added successfully!', position: 'top-right' })
    }
    isSubmitting.value = false
    showDialog.value = false
  }, 600)
}

const confirmDelete = (building) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to remove "${building.name}"? All associated unit data might be affected.`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Delete', unelevated: true },
    cancel: { flat: true, color: 'grey-8', label: 'Cancel' }
  }).onOk(() => {
    buildings.value = buildings.value.filter(b => b.id !== building.id)
    $q.notify({ type: 'info', message: 'Building removed.', position: 'top-right' })
  })
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.line-height-tight {
  line-height: 1.2;
}
.rounded-borders {
  border-radius: 12px;
}
.building-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.building-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}
.image-container {
  border-bottom: 1px solid #e0e0e0;
}
</style>
