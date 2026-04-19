<template>
  <q-page padding class="bg-grey-1 flex justify-center">
    <div class="full-width" style="max-width: 1000px;">

      <div class="row items-center justify-between q-mb-lg q-mt-sm">
        <div>
          <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Maintenance Requests</h4>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">Report issues and track repair progress</div>
        </div>
        <q-btn
          color="primary"
          icon="add_circle"
          label="New Request"
          unelevated
          class="text-weight-bold shadow-2"
          padding="8px 16px"
          @click="openNewRequest"
        />
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="requests.length === 0" class="text-center q-pa-xl bg-white shadow-1 rounded-borders q-mt-md">
        <q-icon name="home_repair_service" size="80px" color="grey-4" />
        <div class="text-h6 text-weight-medium q-mt-md text-dark">No maintenance requests</div>
        <div class="text-grey-7 q-mb-md">Everything looks good! If you find an issue, report it here.</div>
        <q-btn outline color="primary" label="Submit a Request" @click="openNewRequest" />
      </div>

      <div v-else class="row q-col-gutter-md">
        <div class="col-12 col-md-6" v-for="req in sortedRequests" :key="req.id">
          <q-card bordered flat class="shadow-1 request-card bg-white column fit">
            <q-card-section>

              <div class="row justify-between items-center q-mb-sm">
                <div class="text-caption text-weight-bold text-grey-6 row items-center">
                  <q-icon name="calendar_today" size="xs" class="q-mr-xs"/> {{ req.date }}
                </div>
                <StatusBadge :status="req.status" />
              </div>

              <div class="row items-start justify-between q-mt-sm">
                <div class="text-h6 text-weight-bold text-dark line-height-tight col-9">
                  {{ req.title }}
                </div>
                <q-badge
                  :color="getPriorityColor(req.priority)"
                  class="text-weight-bold q-pa-xs"
                  rounded
                >
                  {{ req.priority }}
                </q-badge>
              </div>

              <div class="text-caption text-primary text-weight-medium q-mt-xs q-mb-md text-uppercase">
                <q-icon :name="getCategoryIcon(req.category)" size="sm" class="q-mr-xs" />
                {{ req.category }}
              </div>

              <q-separator class="q-mb-md" />

              <p class="text-body2 text-grey-8 q-mb-none" style="line-height: 1.5;">
                {{ req.description }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>

    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <q-icon name="build" size="sm" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">Submit Maintenance Request</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="submitRequest" class="q-gutter-y-md">

            <q-input
              outlined
              dense
              v-model="newRequest.title"
              label="Issue Title *"
              placeholder="e.g., Leaking Kitchen Sink"
              autofocus
              :rules="[val => !!val || 'Title is required']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  v-model="newRequest.category"
                  :options="categories"
                  label="Category *"
                  :rules="[val => !!val || 'Category is required']"
                >
                  <template v-slot:prepend><q-icon name="category" color="grey-7" /></template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  v-model="newRequest.priority"
                  :options="priorities"
                  label="Priority Level *"
                  :rules="[val => !!val || 'Priority is required']"
                >
                  <template v-slot:prepend><q-icon name="low_priority" color="grey-7" /></template>
                </q-select>
              </div>
            </div>

            <q-input
              outlined
              type="textarea"
              v-model="newRequest.description"
              label="Detailed Description *"
              placeholder="Please describe the issue, its exact location, and when it started."
              rows="4"
              :rules="[val => !!val || 'Description is required']"
            />

            <div>
              <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Attach Photo (Optional)</div>
              <q-file
                outlined
                dense
                v-model="newRequest.photo"
                label="Choose an image..."
                accept="image/*"
              >
                <template v-slot:prepend><q-icon name="add_a_photo" color="grey-7" /></template>
              </q-file>
            </div>

            <div class="row justify-end q-mt-lg q-gutter-x-sm">
              <q-btn flat label="Cancel" color="grey-8" class="text-weight-bold" v-close-popup />
              <q-btn
                unelevated
                label="Submit Request"
                color="primary"
                type="submit"
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
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

// --- UI State ---
const showDialog = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)

// --- Options ---
const categories = ['Plumbing', 'Electrical', 'HVAC / AC', 'Appliances', 'Structural', 'Other']
const priorities = ['Low', 'Normal', 'High', 'Emergency']

// --- Data State ---
const requests = ref([])

const newRequest = reactive({
  title: '',
  category: '',
  priority: 'Normal',
  description: '',
  photo: null
})

const LOCAL_STORAGE_KEY = 'tenant_maintenance_requests'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchRequests()
})

const fetchRequests = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenant/maintenance')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (savedData) {
      requests.value = JSON.parse(savedData)
    } else {
      // Default Mock Data
      requests.value = [
        {
          id: 'REQ-1042',
          date: '2026-04-10',
          title: 'Leaking Faucet',
          category: 'Plumbing',
          priority: 'Normal',
          description: 'The kitchen sink is leaking continuously from the base of the tap.',
          status: 'open'
        },
        {
          id: 'REQ-1011',
          date: '2026-02-15',
          title: 'Heater Broken',
          category: 'HVAC / AC',
          priority: 'High',
          description: 'No hot water coming from the master bathroom shower.',
          status: 'resolved'
        }
      ]
    }
    isLoading.value = false
  }, 600) // Simulated network delay
}

// Auto-save to Local Storage
watch(requests, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// --- Computed ---
// Sort requests so the newest ones and 'open' ones appear at the top
const sortedRequests = computed(() => {
  return [...requests.value].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1
    if (a.status !== 'open' && b.status === 'open') return 1
    return new Date(b.date) - new Date(a.date)
  })
})

// --- Methods ---

const openNewRequest = () => {
  // Reset form
  newRequest.title = ''
  newRequest.category = ''
  newRequest.priority = 'Normal'
  newRequest.description = ''
  newRequest.photo = null
  showDialog.value = true
}

const submitRequest = () => {
  isSubmitting.value = true

  // INTEGRATION POINT:
  // Use FormData if sending a photo:
  // const formData = new FormData()
  // formData.append('title', newRequest.title) ...
  // axios.post('/api/tenant/maintenance', formData)

  setTimeout(() => {
    const today = new Date().toISOString().split('T')[0]

    requests.value.unshift({
      id: `REQ-${Math.floor(Math.random() * 10000)}`, // Generate mock ID
      date: today,
      title: newRequest.title,
      category: newRequest.category,
      priority: newRequest.priority,
      description: newRequest.description,
      status: 'open'
    })

    $q.notify({
      type: 'positive',
      message: 'Maintenance request submitted successfully.',
      position: 'top-right'
    })

    isSubmitting.value = false
    showDialog.value = false
  }, 800)
}

// --- Helper UI Functions ---
const getCategoryIcon = (category) => {
  const icons = {
    'Plumbing': 'water_drop',
    'Electrical': 'electrical_services',
    'HVAC / AC': 'ac_unit',
    'Appliances': 'kitchen',
    'Structural': 'home_work',
    'Other': 'build'
  }
  return icons[category] || 'build'
}

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'grey-6',
    'Normal': 'info',
    'High': 'orange',
    'Emergency': 'negative'
  }
  return colors[priority] || 'primary'
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
.request-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}
</style>
