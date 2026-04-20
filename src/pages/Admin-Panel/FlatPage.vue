<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Unit Inventory</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage flats, rent amounts, and vacancy status</div>
      </div>
      <q-btn color="primary" icon="add" label="Add New Unit" unelevated class="text-weight-bold shadow-2" @click="showDialog = true" />
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders bg-white">
      <q-table :rows="flats" :columns="columns" row-key="id" flat :loading="isLoading">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.status === 'Vacant' ? 'positive' : props.row.status === 'Maintenance' ? 'warning' : 'primary'">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round dense color="negative" icon="delete" @click="removeFlat(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 400px;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6 text-weight-bold">Register Unit</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveFlat" class="q-gutter-y-md">
            <q-input outlined dense v-model="form.unit" label="Unit Number (e.g., A-101) *" :rules="[val => !!val || 'Required']" />
            <q-input outlined dense v-model.number="form.rent" type="number" label="Monthly Rent (৳) *" :rules="[val => !!val || 'Required']" />
            <q-select outlined dense v-model="form.status" :options="['Vacant', 'Occupied', 'Maintenance']" label="Status" />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup />
              <q-btn label="Save Unit" color="primary" type="submit" unelevated :loading="isSubmitting" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)
const isSubmitting = ref(false)
const showDialog = ref(false)

const LOCAL_STORAGE_KEY = 'house_rent_flats' // BRIDGE KEY
const flats = ref([])

const form = reactive({ unit: '', rent: null, status: 'Vacant' })

const columns = [
  { name: 'unit', label: 'Unit No', field: 'unit', align: 'left', sortable: true },
  { name: 'rent', label: 'Monthly Rent (৳)', field: 'rent', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

onMounted(() => {
  setTimeout(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) flats.value = JSON.parse(saved)
    else {
      flats.value = [
        { id: 1, unit: 'A-101', rent: 15000, status: 'Occupied' },
        { id: 2, unit: 'A-102', rent: 12000, status: 'Vacant' }
      ]
    }
    isLoading.value = false
  }, 500)
})

watch(flats, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const saveFlat = () => {
  isSubmitting.value = true
  setTimeout(() => {
    flats.value.unshift({ id: Date.now(), ...form })
    form.unit = ''; form.rent = null; form.status = 'Vacant';
    isSubmitting.value = false
    showDialog.value = false
    $q.notify({ type: 'positive', message: 'Unit added successfully!' })
  }, 600)
}

const removeFlat = (id) => {
  flats.value = flats.value.filter(f => f.id !== id)
}
</script>
