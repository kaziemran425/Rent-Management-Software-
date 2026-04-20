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
          class="text-weight-bold shadow-2 q-mt-md q-mt-sm-none"
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
                  <q-icon name="tag" size="xs" class="q-mr-xs"/> {{ req.id }} • {{ req.date }}
                </div>
                <q-badge :color="req.status === 'resolved' ? 'positive' : req.status === 'in_progress' ? 'info' : 'negative'">
                  {{ req.status.toUpperCase() }}
                </q-badge>
              </div>

              <div class="row items-start justify-between q-mt-sm">
                <div class="text-h6 text-weight-bold text-dark line-height-tight col-9">
                  {{ req.title }}
                </div>
                <q-badge :color="getPriorityColor(req.priority)" class="text-weight-bold q-pa-xs" rounded>
                  {{ req.priority }}
                </q-badge>
              </div>

              <div class="text-caption text-primary text-weight-medium q-mt-xs q-mb-md text-uppercase">
                <q-icon name="build" size="sm" class="q-mr-xs" /> {{ req.category }}
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
            <q-input outlined dense v-model="newRequest.title" label="Issue Title *" autofocus :rules="[val => !!val || 'Required']" />
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select outlined dense v-model="newRequest.category" :options="['Plumbing', 'Electrical', 'HVAC / AC', 'Appliances', 'Other']" label="Category *" :rules="[val => !!val || 'Required']" />
              </div>
              <div class="col-6">
                <q-select outlined dense v-model="newRequest.priority" :options="['Low', 'Normal', 'High', 'Emergency']" label="Priority *" :rules="[val => !!val || 'Required']" />
              </div>
            </div>
            <q-input outlined type="textarea" v-model="newRequest.description" label="Detailed Description *" rows="4" :rules="[val => !!val || 'Required']" />

            <div class="row justify-end q-mt-lg q-gutter-x-sm">
              <q-btn flat label="Cancel" color="grey-8" class="text-weight-bold" v-close-popup />
              <q-btn unelevated label="Submit Request" color="primary" type="submit" class="text-weight-bold" :loading="isSubmitting" />
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
const showDialog = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)

const LOCAL_STORAGE_KEY = 'tenant_maintenance_requests'
const requests = ref([])

const newRequest = reactive({ title: '', category: '', priority: 'Normal', description: '' })

onMounted(() => {
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      requests.value = JSON.parse(savedData)
    } else {
      requests.value = [
        { id: 'REQ-1042', date: '2026-04-10', title: 'Leaking Faucet', category: 'Plumbing', priority: 'Normal', description: 'Sink is leaking.', tenant: 'Kazi Emran', flat: 'A-101', status: 'open' }
      ]
    }
    isLoading.value = false
  }, 500)
})

watch(requests, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const sortedRequests = computed(() => {
  return [...requests.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const submitRequest = () => {
  isSubmitting.value = true
  setTimeout(() => {
    requests.value.unshift({
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      title: newRequest.title,
      category: newRequest.category,
      priority: newRequest.priority,
      description: newRequest.description,
      tenant: 'Kazi Emran', // Mocking current logged in user
      flat: 'A-101',
      status: 'open'
    })

    newRequest.title = ''; newRequest.category = ''; newRequest.description = '';
    $q.notify({ type: 'positive', message: 'Request submitted to Admin.', position: 'top-right' })
    isSubmitting.value = false
    showDialog.value = false
  }, 600)
}

const getPriorityColor = (priority) => {
  const colors = { 'Low': 'grey-6', 'Normal': 'info', 'High': 'orange', 'Emergency': 'negative' }
  return colors[priority] || 'primary'
}
</script>

<style scoped>
.request-card { border-radius: 12px; }
</style>
