<template>
  <q-page padding>
    <div class="q-mb-md">
      <h4 class="text-h5 q-my-none text-weight-bold">Rent & Invoices</h4>
    </div>

    <q-card bordered class="shadow-1">
      <q-table
        :rows="invoices"
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
            <q-btn size="sm" color="info" icon="download" flat dense>
              <q-tooltip>Download PDF</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'pending' || props.row.status === 'overdue'"
              size="sm" color="primary" label="Pay"
              @click="openPaymentModal(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import StatusBadge from 'src/components/StatusBadge.vue'

const columns = [
  { name: 'month', label: 'Billing Month', field: 'month', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left' },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const invoices = ref([
  { id: 1, month: 'May 2026', amount: '$850.00', dueDate: '2026-05-01', status: 'pending' },
  { id: 2, month: 'April 2026', amount: '$850.00', dueDate: '2026-04-01', status: 'paid' },
  { id: 3, month: 'March 2026', amount: '$850.00', dueDate: '2026-03-01', status: 'paid' }
])

const openPaymentModal = (invoice) => {
  // Logic to open Stripe/Bank payment gateway
  console.log('Paying invoice:', invoice.id)
}
</script>
