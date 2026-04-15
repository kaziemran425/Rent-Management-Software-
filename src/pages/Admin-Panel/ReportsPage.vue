<template>
  <q-page padding>
    <div class="q-mb-lg">
      <h4 class="text-h5 q-my-none text-weight-bold">Financial & Occupancy Reports</h4>
      <div class="text-subtitle2 text-grey-7">Overview of current month metrics</div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card bordered class="bg-primary text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Total Revenue (This Month)</div>
            <div class="text-h4 text-weight-bold">$12,450</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card bordered class="bg-positive text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Occupancy Rate</div>
            <div class="text-h4 text-weight-bold">92%</div>
            <div class="text-caption">23 of 25 flats occupied</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card bordered class="bg-negative text-white shadow-2">
          <q-card-section>
            <div class="text-subtitle1">Pending Dues</div>
            <div class="text-h4 text-weight-bold">$1,200</div>
            <div class="text-caption">3 tenants overdue</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card bordered class="shadow-1">
      <q-card-section>
        <div class="text-h6">Recent Rent Collections</div>
      </q-card-section>
      <q-separator />
      <q-table
        :rows="transactions"
        :columns="columns"
        row-key="id"
        flat
        hide-bottom
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'tenant', label: 'Tenant', field: 'tenant', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'method', label: 'Payment Method', field: 'method', align: 'center' }
]

const transactions = ref([
  { id: 1, date: '2026-04-14', tenant: 'Alice Johnson', amount: '$850', method: 'Bank Transfer' },
  { id: 2, date: '2026-04-12', tenant: 'Bob Smith', amount: '$900', method: 'Credit Card' },
  { id: 3, date: '2026-04-10', tenant: 'Charlie Brown', amount: '$850', method: 'Cash' }
])
</script>
