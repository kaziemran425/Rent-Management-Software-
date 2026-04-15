<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Agreement Reviews</h4>
      <q-btn color="primary" icon="refresh" label="Refresh" outline />
    </div>

    <q-card bordered class="shadow-1">
      <q-table
        :rows="agreements"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <StatusBadge :status="props.row.status" />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn size="sm" color="info" icon="visibility" flat dense>
              <q-tooltip>Review Document</q-tooltip>
            </q-btn>
            <q-btn size="sm" color="positive" icon="check_circle" flat dense @click="approve(props.row.id)" v-if="props.row.status === 'reviewing'">
              <q-tooltip>Approve</q-tooltip>
            </q-btn>
            <q-btn size="sm" color="negative" icon="cancel" flat dense @click="reject(props.row.id)" v-if="props.row.status === 'reviewing'">
              <q-tooltip>Reject</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

const columns = [
  { name: 'tenant', label: 'Tenant Name', field: 'tenant', align: 'left', sortable: true },
  { name: 'property', label: 'Property/Flat', field: 'property', align: 'left' },
  { name: 'date', label: 'Submitted On', field: 'date', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const agreements = ref([
  { id: 1, tenant: 'Alice Johnson', property: 'Building A - Flat 101', date: '2026-04-12', status: 'reviewing' },
  { id: 2, tenant: 'Bob Smith', property: 'Building B - Flat 204', date: '2026-04-10', status: 'active' },
  { id: 3, tenant: 'Charlie Brown', property: 'Building A - Flat 102', date: '2026-04-09', status: 'rejected' }
])

const approve = (id) => {
  $q.notify({ type: 'positive', message: `Agreement #${id} approved.` })
  // API call goes here
}

const reject = (id) => {
  $q.notify({ type: 'negative', message: `Agreement #${id} rejected.` })
  // API call goes here
}
</script>
