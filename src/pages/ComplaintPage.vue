<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Maintenance & Support</div>
        <div class="text-subtitle1 text-grey-7">Report issues and track repair status</div>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2">
          <q-card-section class="bg-indigo-9 text-white">
            <div class="text-h6">Open New Ticket</div>
          </q-card-section>
          
          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="submitComplaint" class="q-gutter-y-md">
              <q-select 
                v-model="form.category" 
                :options="['Plumbing', 'Electrical', 'Appliance Repair', 'Security', 'Other']" 
                label="Issue Category *" 
                outlined 
                dense 
                :rules="[val => !!val || 'Category is required']"
              />
              <q-input 
                v-model="form.subject" 
                label="Subject *" 
                outlined 
                dense 
                :rules="[val => !!val || 'Subject is required']"
              />
              <q-input 
                v-model="form.description" 
                type="textarea" 
                label="Describe the issue in detail..." 
                outlined 
                :rules="[val => !!val || 'Description is required']"
              />
              <q-btn label="SUBMIT TICKET" color="indigo-9" type="submit" unelevated class="full-width text-bold" :loading="loading" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="shadow-2">
          <q-table
            title="My Ticket History"
            :rows="complaints"
            :columns="columns"
            row-key="id"
            flat
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip 
                  :color="props.value === 'Resolved' ? 'positive' : props.value === 'Pending' ? 'orange-9' : 'blue-8'" 
                  text-color="white" 
                  size="sm"
                  class="text-bold"
                >
                  {{ props.value }}
                </q-chip>
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
const loading = ref(false)

const form = reactive({ category: '', subject: '', description: '' })
const complaints = ref([])

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]

const LOCAL_STORAGE_KEY = 'house_rent_complaints'

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedData) {
    complaints.value = JSON.parse(savedData)
  } else {
    complaints.value = [
      { id: 1, date: '2026-03-15', category: 'Electrical', subject: 'Hallway light broken', status: 'Resolved' }
    ]
  }
})

watch(complaints, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const submitComplaint = () => {
  loading.value = true
  setTimeout(() => {
    // INTEGRATION POINT: axios.post('/api/complaints', form)
    complaints.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      category: form.category,
      subject: form.subject,
      status: 'Pending'
    })

    form.category = ''
    form.subject = ''
    form.description = ''
    
    $q.notify({ type: 'positive', message: 'Ticket submitted successfully. Admin has been notified.', position: 'top' })
    loading.value = false
  }, 600)
}
</script>