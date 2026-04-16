<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Agreement Reviews</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage and approve tenant lease agreements</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn color="primary" icon="refresh" outline padding="8px 16px" @click="fetchAgreements" />
        <q-btn color="primary" icon="add" label="Add Agreement" unelevated class="text-weight-bold shadow-2" padding="8px 16px" @click="showDialog = true" />
      </div>
    </div>

    <q-card flat bordered class="shadow-1 rounded-borders">
      <q-table
        :rows="filteredAgreements"
        :columns="columns"
        row-key="id"
        flat
        :loading="isTableLoading"
        :pagination="{ rowsPerPage: 10 }"
        table-header-class="bg-grey-2 text-dark text-weight-bold"
      >
        <template v-slot:top>
          <div class="text-h6 text-weight-bold text-dark col">All Agreements</div>
          <q-space />
          <div class="row q-gutter-sm items-center">
            <q-select
              v-model="statusFilter"
              :options="['All', 'active', 'reviewing', 'rejected']"
              outlined
              dense
              bg-color="white"
              options-dense
              style="min-width: 130px"
            />
            <q-input outlined dense v-model="searchQuery" placeholder="Search tenants..." bg-color="white">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <StatusBadge :status="props.row.status" />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn size="sm" color="info" icon="visibility" flat dense @click="viewDocument(props.row)">
              <q-tooltip>Review Documents</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'reviewing'"
              size="sm" color="positive" icon="check_circle" flat dense
              @click="approve(props.row.id)"
            >
              <q-tooltip>Approve</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.status === 'reviewing'"
              size="sm" color="negative" icon="cancel" flat dense
              @click="reject(props.row.id)"
            >
              <q-tooltip>Reject</q-tooltip>
            </q-btn>
            <q-btn
              size="sm" color="grey-6" icon="delete" flat dense
              @click="deleteAgreement(props.row.id)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showViewDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-2 column">
        <q-bar class="bg-primary text-white q-py-lg">
          <q-icon name="description" size="sm" />
          <div class="text-subtitle1 text-weight-bold q-ml-sm">Document Viewer</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="col row q-col-gutter-md q-pa-md">
          <div class="col-12 col-md-4 col-lg-3 column q-gutter-y-md">
            <q-card bordered flat class="bg-white">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Agreement Details</div>

                <q-list dense padding class="text-body1">
                  <q-item>
                    <q-item-section class="text-grey-7">Tenant Name</q-item-section>
                    <q-item-section side class="text-dark text-weight-bold">{{ selectedAgreement?.tenant }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="text-grey-7">Property</q-item-section>
                    <q-item-section side class="text-dark text-weight-bold">{{ selectedAgreement?.property }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="text-grey-7">Submitted On</q-item-section>
                    <q-item-section side class="text-dark text-weight-bold">{{ selectedAgreement?.date }}</q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="text-grey-7">Current Status</q-item-section>
                    <q-item-section side>
                      <StatusBadge :status="selectedAgreement?.status || 'default'" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator />
              <q-card-actions vertical class="q-pa-md" v-if="selectedAgreement?.status === 'reviewing'">
                <q-btn color="positive" icon="check_circle" label="Approve Agreement" class="full-width q-mb-sm" @click="approve(selectedAgreement.id)" />
                <q-btn color="negative" outline icon="cancel" label="Reject Agreement" class="full-width" @click="reject(selectedAgreement.id)" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-md-8 col-lg-9 column q-gutter-y-md">
            <q-card bordered flat class="col bg-white flex flex-center rounded-borders">
              <div class="text-center text-grey-5 q-pa-xl">
                <q-icon name="picture_as_pdf" size="100px" class="q-mb-md color-primary" />
                <div class="text-h5 text-weight-bold text-dark q-mb-sm">{{ selectedAgreement?.documentName || 'No Document Attached' }}</div>
                <div class="text-subtitle1">PDF/Word Preview Area</div>
                <div class="text-caption q-mt-md">Ready for API integration (e.g., &lt;iframe :src="pdfUrl" /&gt;)</div>
              </div>
            </q-card>

            <q-card bordered flat class="col-auto bg-white flex flex-center rounded-borders" v-if="selectedAgreement?.imageName">
              <div class="text-center text-grey-5 q-pa-md">
                <q-icon name="image" size="60px" class="q-mb-sm" />
                <div class="text-h6 text-weight-bold text-dark">{{ selectedAgreement?.imageName }}</div>
                <div class="text-caption">Attached Image / ID Proof</div>
              </div>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center bg-primary text-white q-py-md">
          <div class="text-h6 text-weight-bold">Upload New Agreement</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="submitAgreement" class="q-gutter-y-md">

            <q-input
              v-model="form.tenant"
              label="Tenant Name *"
              outlined
              dense
              :rules="[val => !!val || 'Tenant name is required']"
            >
              <template v-slot:prepend><q-icon name="person" color="grey-7" /></template>
            </q-input>

            <q-select
              v-model="form.property"
              :options="unitOptions"
              label="Property / Flat *"
              outlined
              dense
              options-dense
              :rules="[val => !!val || 'Property is required']"
            >
              <template v-slot:prepend><q-icon name="meeting_room" color="grey-7" /></template>
            </q-select>

            <q-input
              v-model="form.date"
              label="Agreement Date *"
              type="date"
              outlined
              dense
              :rules="[val => !!val || 'Date is required']"
            />

            <div class="q-mt-md">
              <div class="text-caption text-grey-8 q-mb-sm text-weight-bold">Upload Document (PDF/Word) *</div>
              <q-uploader
                ref="docUploaderRef"
                url="/api/mock/upload"
                color="primary"
                flat
                bordered
                accept=".pdf, .doc, .docx"
                style="width: 100%"
                hide-upload-btn
                @added="onDocAdded"
                @removed="onDocRemoved"
              />
            </div>

            <div class="q-mt-md">
              <div class="text-caption text-grey-8 q-mb-sm text-weight-bold">Upload Supporting Image (Optional)</div>
              <q-uploader
                ref="imgUploaderRef"
                url="/api/mock/upload"
                color="secondary"
                flat
                bordered
                accept="image/*"
                style="width: 100%"
                hide-upload-btn
                @added="onImgAdded"
                @removed="onImgRemoved"
              />
            </div>

            <div class="row justify-end q-mt-xl q-gutter-x-sm">
              <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
              <q-btn
                label="Save Agreement"
                color="primary"
                type="submit"
                unelevated
                class="text-weight-bold"
                :loading="isSubmitting"
              />
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
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

// --- UI & Table State ---
const showDialog = ref(false)
const showViewDialog = ref(false)
const selectedAgreement = ref(null)
const isTableLoading = ref(true)
const isSubmitting = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')

// --- Separate Refs for the two uploaders ---
const docUploaderRef = ref(null)
const imgUploaderRef = ref(null)
const uploadedDoc = ref(null)
const uploadedImg = ref(null)

const columns = [
  { name: 'tenant', label: 'Tenant Name', field: 'tenant', align: 'left', sortable: true },
  { name: 'property', label: 'Property/Flat', field: 'property', align: 'left' },
  { name: 'date', label: 'Submitted On', field: 'date', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

// --- Options for the Unit/Property dropdown ---
const unitOptions = ref([
  'Building A - Flat 101',
  'Building A - Flat 102',
  'Building B - Flat 201',
  'Building B - Flat 202',
  'Building C - Flat 301',
  'Building C - Flat 302'
])

// --- Data State ---
const agreements = ref([])

const form = reactive({
  tenant: '',
  property: '',
  date: new Date().toISOString().split('T')[0]
})

const LOCAL_STORAGE_KEY = 'house_rent_agreements'

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchAgreements()
})

const fetchAgreements = () => {
  isTableLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/agreements')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      agreements.value = JSON.parse(savedData)
    } else {
      // Default Mock Data
      agreements.value = [
        { id: 1, tenant: 'Alice Johnson', property: 'Building A - Flat 101', date: '2026-04-12', status: 'reviewing', documentName: 'alice_lease_agreement.pdf', imageName: 'alice_id_proof.jpg' },
        { id: 2, tenant: 'Bob Smith', property: 'Building B - Flat 204', date: '2026-04-10', status: 'active', documentName: 'bob_signed_lease.pdf', imageName: null },
        { id: 3, tenant: 'Charlie Brown', property: 'Building A - Flat 102', date: '2026-04-09', status: 'rejected', documentName: 'charlie_agreement_v1.pdf', imageName: null }
      ]
    }
    isTableLoading.value = false
  }, 600)
}

// Watcher to auto-save to local storage
watch(agreements, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

// --- Computed Filters ---
const filteredAgreements = computed(() => {
  let result = agreements.value

  if (statusFilter.value !== 'All') {
    result = result.filter(item => item.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.tenant.toLowerCase().includes(lowerQuery) ||
      item.property.toLowerCase().includes(lowerQuery)
    )
  }

  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// --- Methods (Uploader & Submit) ---

// Document Handlers
const onDocAdded = (files) => { uploadedDoc.value = files[0] }
const onDocRemoved = () => { uploadedDoc.value = null }

// Image Handlers
const onImgAdded = (files) => { uploadedImg.value = files[0] }
const onImgRemoved = () => { uploadedImg.value = null }


const submitAgreement = () => {
  // Ensure the primary document is uploaded
  if (!uploadedDoc.value) {
    $q.notify({ type: 'warning', message: 'Please upload the main PDF/Word document.', position: 'top-right' })
    return
  }

  isSubmitting.value = true

  // Simulate API Upload Delay
  setTimeout(() => {
    agreements.value.unshift({
      id: Date.now(),
      tenant: form.tenant,
      property: form.property,
      date: form.date,
      status: 'active',
      documentName: uploadedDoc.value.name,
      imageName: uploadedImg.value ? uploadedImg.value.name : null
    })

    $q.notify({ type: 'positive', message: 'Agreement uploaded successfully!', position: 'top-right' })

    // Reset Form & Both Uploaders
    form.tenant = ''
    form.property = ''
    if (docUploaderRef.value) docUploaderRef.value.reset()
    if (imgUploaderRef.value) imgUploaderRef.value.reset()
    uploadedDoc.value = null
    uploadedImg.value = null

    isSubmitting.value = false
    showDialog.value = false
  }, 1000)
}

// --- Methods (Actions) ---

const viewDocument = (row) => {
  selectedAgreement.value = row
  showViewDialog.value = true
}

const approve = (id) => {
  const index = agreements.value.findIndex(a => a.id === id)
  if (index !== -1) agreements.value[index].status = 'active'
  $q.notify({ type: 'positive', message: `Agreement approved.`, position: 'top-right' })

  if (showViewDialog.value) showViewDialog.value = false
}

const reject = (id) => {
  const index = agreements.value.findIndex(a => a.id === id)
  if (index !== -1) agreements.value[index].status = 'rejected'
  $q.notify({ type: 'negative', message: `Agreement rejected.`, position: 'top-right' })

  if (showViewDialog.value) showViewDialog.value = false
}

const deleteAgreement = (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this agreement?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    agreements.value = agreements.value.filter(a => a.id !== id)
    $q.notify({ type: 'info', message: 'Agreement deleted.', position: 'top-right' })
  })
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
</style>
