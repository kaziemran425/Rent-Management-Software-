<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Tenant Directory</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage renters and track statuses</div>
      </div>
      <q-btn color="primary" icon="person_add" label="New Tenant" unelevated class="text-weight-bold" @click="showDialog = true" />
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders bg-white">
      <q-table :rows="tenants" :columns="columns" row-key="id" flat :loading="isLoading">
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.row.status === 'Active' ? 'positive' : 'grey-6'" class="text-weight-bold">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round dense color="negative" icon="person_remove" @click="removeTenant(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6 text-weight-bold">Register New Tenant</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveTenant" class="q-gutter-y-md">
            <q-input outlined dense v-model="form.name" label="Full Name *" :rules="[val => !!val || 'Required']" />
            <div class="row q-col-gutter-md">
              <div class="col-6"><q-input outlined dense v-model="form.phone" label="Phone *" :rules="[val => !!val || 'Required']" /></div>
              <div class="col-6"><q-input outlined dense v-model="form.email" label="Email *" type="email" :rules="[val => !!val || 'Required']" /></div>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6"><q-select outlined dense v-model="form.unit" :options="['A-101', 'A-102', 'B-201']" label="Assign Unit *" :rules="[val => !!val || 'Required']" /></div>
              <div class="col-6"><q-input outlined dense v-model.number="form.advance" type="number" label="Advance (৳)" /></div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup />
              <q-btn label="Save Tenant" color="primary" type="submit" unelevated :loading="isSubmitting" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)
const isSubmitting = ref(false)
const showDialog = ref(false)

const LOCAL_STORAGE_KEY = 'house_rent_tenants' // BRIDGE KEY
const tenants = ref([])

const form = reactive({ name: '', phone: '', email: '', unit: '', advance: 0, status: 'Active' })

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'unit', label: 'Unit', field: 'unit', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const fetchTenants = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) tenants.value = JSON.parse(saved)
  isLoading.value = false
}

onMounted(() => {
  fetchTenants()
  window.addEventListener('storage', fetchTenants) // Listen for Tenant updating profile
})
onUnmounted(() => window.removeEventListener('storage', fetchTenants))

watch(tenants, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const saveTenant = () => {
  isSubmitting.value = true
  setTimeout(() => {
    tenants.value.unshift({
      id: `TENANT-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      ...form
    })
    form.name = ''; form.phone = ''; form.email = ''; form.unit = ''; form.advance = 0;
    isSubmitting.value = false
    showDialog.value = false
    $q.notify({ type: 'positive', message: 'Tenant added successfully.' })
  }, 600)
}

const removeTenant = (id) => {
  tenants.value = tenants.value.filter(t => t.id !== id)
}
</script>
