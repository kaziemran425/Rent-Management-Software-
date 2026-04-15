<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Maintenance Requests</h4>
      <q-btn color="primary" icon="add" label="New Request" @click="showDialog = true" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6" v-for="req in requests" :key="req.id">
        <q-card bordered class="shadow-1">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <div class="text-caption text-grey-7">Date: {{ req.date }}</div>
              <StatusBadge :status="req.status" />
            </div>
            <div class="text-h6">{{ req.title }}</div>
            <p class="text-body2 q-mt-sm">{{ req.description }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Submit New Request</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-input outlined v-model="newRequest.title" label="Issue Title (e.g., Leaking Pipe)" autofocus />
            <q-input outlined type="textarea" v-model="newRequest.description" label="Describe the issue in detail" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Submit Request" @click="submitRequest" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()
const showDialog = ref(false)

const requests = ref([
  { id: 1, date: '2026-04-10', title: 'Leaking Faucet', description: 'Kitchen sink is leaking.', status: 'open' },
  { id: 2, date: '2026-02-15', title: 'Heater Broken', description: 'No hot water.', status: 'resolved' }
])

const newRequest = ref({ title: '', description: '' })

const submitRequest = () => {
  requests.value.unshift({
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    title: newRequest.value.title,
    description: newRequest.value.description,
    status: 'open'
  })
  newRequest.value = { title: '', description: '' }
  $q.notify({ type: 'positive', message: 'Maintenance request submitted.' })
}
</script>
