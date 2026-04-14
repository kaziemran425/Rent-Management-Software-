<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-5">
        <q-card flat bordered>
          <q-card-section class="bg-indigo-9 text-white">
            <div class="text-h6">Report a New Issue</div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="submitComplaint">
              <q-select v-model="form.category" :options="['Plumbing', 'Electrical', 'Security', 'Other']" label="Category" outlined dense />
              <q-input v-model="form.subject" label="Subject" outlined dense />
              <q-input v-model="form.description" type="textarea" label="Describe the problem..." outlined />
              <q-btn label="Submit Complaint" color="indigo-9" class="full-width" unelevated type="submit" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Complaint History</div>
          </q-card-section>
          <q-table :rows="complaints" :columns="columns" row-key="id" flat bordered>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.status === 'Resolved' ? 'positive' : 'orange'">
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const form = reactive({ category: null, subject: '', description: '' })
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'subject', label: 'Subject', field: 'subject', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]
const complaints = ref([{ id: 'CMP-001', date: '2026-04-10', subject: 'Leaking Faucet', status: 'In Progress' }])

const submitComplaint = () => {
  $q.notify({ type: 'positive', message: 'Complaint submitted successfully!' })
  form.subject = ''; form.description = ''; form.category = null;
}
</script>