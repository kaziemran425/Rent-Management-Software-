<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Notice Management</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Create and broadcast announcements to tenants</div>
      </div>
      <q-btn color="primary" icon="add_alert" label="Create Notice" unelevated class="text-weight-bold" @click="showDialog = true" />
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders bg-white">
      <q-table :rows="notices" :columns="columns" row-key="id" flat :loading="isLoading">
        <template v-slot:body-cell-urgent="props">
          <q-td :props="props">
            <q-badge :color="props.row.urgent ? 'negative' : 'grey-5'" class="text-weight-bold">
              {{ props.row.urgent ? 'URGENT' : 'Standard' }}
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteNotice(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6 text-weight-bold">New Announcement</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveNotice" class="q-gutter-y-md">
            <q-input outlined dense v-model="form.title" label="Notice Title *" :rules="[val => !!val || 'Required']" />
            <q-input outlined type="textarea" v-model="form.content" label="Message Content *" rows="4" :rules="[val => !!val || 'Required']" />
            <q-toggle v-model="form.urgent" color="negative" label="Mark as Urgent" />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup />
              <q-btn label="Publish Notice" color="primary" type="submit" unelevated :loading="isSubmitting" />
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

const LOCAL_STORAGE_KEY = 'house_rent_notices' // SAME KEY AS TENANT PANEL!
const notices = ref([])

const form = reactive({ title: '', content: '', urgent: false })

const columns = [
  { name: 'date', label: 'Date Published', field: 'date', align: 'left', sortable: true },
  { name: 'title', label: 'Title', field: 'title', align: 'left' },
  { name: 'urgent', label: 'Priority', field: 'urgent', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

onMounted(() => {
  setTimeout(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) notices.value = JSON.parse(saved)
    isLoading.value = false
  }, 500)
})

watch(notices, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const saveNotice = () => {
  isSubmitting.value = true
  setTimeout(() => {
    notices.value.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: form.title,
      content: form.content,
      urgent: form.urgent
    })
    form.title = ''; form.content = ''; form.urgent = false;
    isSubmitting.value = false
    showDialog.value = false
    $q.notify({ type: 'positive', message: 'Notice Published globally.' })
  }, 600)
}

const deleteNotice = (id) => {
  notices.value = notices.value.filter(n => n.id !== id)
}
</script>
