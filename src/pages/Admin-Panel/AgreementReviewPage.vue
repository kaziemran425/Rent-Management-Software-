<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <h4 class="text-h4 text-weight-bolder text-dark q-my-none">Agreement Review</h4>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders bg-white">
      <q-table :rows="agreements" :columns="columns" row-key="id" flat :loading="isLoading">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.status === 'active' ? 'positive' : props.row.status === 'reviewing' ? 'info' : 'negative'">
              {{ props.row.status.toUpperCase() }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn v-if="props.row.status === 'reviewing'" size="sm" color="positive" label="Approve" unelevated class="q-mr-sm" @click="updateStatus(props.row, 'active')" />
            <q-btn v-if="props.row.status === 'reviewing'" size="sm" color="negative" label="Reject" outline @click="updateStatus(props.row, 'rejected')" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)

const LOCAL_STORAGE_KEY = 'house_rent_agreements'
const agreements = ref([])

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'name', label: 'Tenant Name', field: 'name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const fetchAgreements = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) agreements.value = JSON.parse(saved)
  isLoading.value = false
}

onMounted(() => {
  fetchAgreements()
  // Listen for Tenant submitting an agreement in another tab!
  window.addEventListener('storage', fetchAgreements)
})
onUnmounted(() => window.removeEventListener('storage', fetchAgreements))

const updateStatus = (row, status) => {
  const index = agreements.value.findIndex(a => a.id === row.id)
  if (index !== -1) {
    agreements.value[index].status = status
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agreements.value))
    $q.notify({ type: status === 'active' ? 'positive' : 'negative', message: `Agreement ${status}` })
  }
}
</script>
