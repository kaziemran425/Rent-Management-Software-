<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Broadcast Notices</div>
        <div class="text-subtitle1 text-grey-7">Send announcements to tenants and view history</div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      
      <div class="col-12 col-md-5">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section class="bg-indigo-9 text-white row items-center">
            <q-icon name="campaign" size="sm" class="q-mr-sm" />
            <div class="text-h6">Create New Notice</div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="sendNotice" class="q-gutter-y-md">
              
              <q-select 
                outlined 
                multiple 
                v-model="form.target" 
                :options="targetOptions" 
                label="Target Audience *" 
                dense
                use-chips
                :rules="[val => val && val.length > 0 || 'Please select an audience']"
              >
                <template v-slot:prepend><q-icon name="group" /></template>
              </q-select>

              <q-input 
                outlined 
                label="Notice Subject *" 
                v-model="form.subject" 
                dense
                :rules="[val => !!val || 'Subject is required']"
              >
                <template v-slot:prepend><q-icon name="title" /></template>
              </q-input>

              <div>
                <div class="text-caption text-grey-7 q-mb-xs">Message Body *</div>
                <q-editor 
                  v-model="form.body" 
                  min-height="150px" 
                  :toolbar="[
                    ['bold', 'italic', 'underline', 'strike'],
                    ['unordered', 'ordered'],
                    ['undo', 'redo']
                  ]"
                />
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn 
                  color="indigo-9" 
                  label="Broadcast Now" 
                  icon="send" 
                  type="submit" 
                  unelevated 
                  class="text-bold full-width"
                  size="md"
                  :loading="loading"
                />
              </div>

            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card flat bordered class="shadow-2">
          <q-table
            title="Broadcast History"
            :rows="notices"
            :columns="columns"
            row-key="id"
            flat
            :filter="searchQuery"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="searchQuery" placeholder="Search Notices...">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-target="props">
              <q-td :props="props">
                <q-chip 
                  v-for="audience in props.value" 
                  :key="audience" 
                  color="indigo-1" 
                  text-color="indigo-9" 
                  size="sm"
                  class="text-weight-medium"
                >
                  {{ audience }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge color="positive" class="q-pa-xs text-bold">
                  {{ props.value }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="right">
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
                  <q-tooltip>Delete Record</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- UI & Form State ---
const loading = ref(false)
const searchQuery = ref('')

const targetOptions = [
  'All Tenants', 
  'Building: Green Valley Residency', 
  'Building: Skyline Tower', 
  'Defaulters (Unpaid Rent)'
]

const form = reactive({
  subject: '',
  body: '',
  target: ['All Tenants'] // Default selection
})

// --- Table Configuration ---
const columns = [
  { name: 'date', label: 'Date Sent', field: 'date', align: 'left', sortable: true },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left', sortable: true },
  { name: 'target', label: 'Audience', field: 'target', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

// --- Data State (LocalStorage) ---
const notices = ref([])
const LOCAL_STORAGE_KEY = 'house_rent_notices'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    notices.value = JSON.parse(savedData)
  } else {
    // Dummy initial data
    notices.value = [
      { 
        id: 1, 
        date: '2026-04-10', 
        subject: 'Water Tank Cleaning Tomorrow', 
        target: ['All Tenants'], 
        status: 'Delivered' 
      }
    ]
  }
})

watch(notices, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })


// --- Methods ---

const sendNotice = () => {
  // Validate Editor (q-editor doesn't have built-in rules like q-input)
  if (!form.body || form.body === '<br>') {
    $q.notify({ type: 'negative', message: 'Please enter a message body.', position: 'top' })
    return
  }

  loading.value = true

  setTimeout(() => {
    // INTEGRATION POINT: axios.post('/api/notices/broadcast', form).then(...)

    // Push to history table
    notices.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      subject: form.subject,
      target: [...form.target], // Clone array
      status: 'Delivered'
    })

    $q.notify({ 
      type: 'positive', 
      message: 'Notice broadcasted successfully to selected tenants!', 
      icon: 'send',
      position: 'top' 
    })

    // Reset Form
    form.subject = ''
    form.body = ''
    form.target = ['All Tenants']
    loading.value = false

  }, 800) // Simulated network delay
}

const confirmDelete = (row) => {
  $q.dialog({
    title: 'Delete Notice Record',
    message: `Are you sure you want to delete the record for "${row.subject}"?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Delete' },
    cancel: { flat: true, color: 'grey-8' }
  }).onOk(() => {
    // INTEGRATION POINT: axios.delete(`/api/notices/${row.id}`).then(...)
    notices.value = notices.value.filter(n => n.id !== row.id)
    $q.notify({ type: 'warning', message: 'Notice record deleted.', icon: 'delete', position: 'top' })
  })
}
</script>

<style scoped>
/* Optional: Limits editor height if content gets too long */
.q-editor {
  max-height: 300px;
  overflow-y: auto;
}
</style>