<template>
  <q-page padding class="bg-grey-1 flex flex-center">
    <div class="full-width" style="max-width: 850px;">

      <div class="q-mb-lg text-center">
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Lease Agreement Portal</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Review, sign, and submit your tenancy documents</div>
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else>
        <q-card bordered flat class="shadow-1 rounded-borders text-center q-pa-xl bg-white" v-if="agreementData.status === 'reviewing'">
          <q-icon name="hourglass_empty" size="80px" color="info" class="q-mb-md" />
          <h5 class="text-h5 text-weight-bold q-my-none">Document Under Review</h5>
          <p class="text-body1 text-grey-7 q-mt-sm">
            Your agreement and documents have been submitted successfully. The property manager is currently reviewing them. You will be notified once approved.
          </p>
          <q-btn outline color="primary" label="Refresh Status" class="q-mt-md" @click="fetchMyAgreement" />
        </q-card>

        <q-card bordered flat class="shadow-1 rounded-borders text-center q-pa-xl bg-green-1" v-else-if="agreementData.status === 'active'">
          <q-icon name="verified" size="80px" color="positive" class="q-mb-md" />
          <h5 class="text-h5 text-weight-bold text-positive q-my-none">Agreement Active</h5>
          <p class="text-body1 text-green-9 q-mt-sm">
            Congratulations! Your lease agreement has been approved and is currently active.
          </p>
          <div class="q-mt-md q-gutter-sm">
            <q-btn unelevated color="positive" icon="download" label="Download Copy" />
          </div>
        </q-card>

        <q-card bordered flat class="shadow-2 rounded-borders bg-white" v-else>

          <q-banner class="bg-red-1 text-negative q-pa-md" v-if="agreementData.status === 'rejected'">
            <template v-slot:avatar>
              <q-icon name="error" color="negative" />
            </template>
            <div class="text-weight-bold">Your previous submission was rejected.</div>
            <div>Please review the terms, upload the correct documents, and try again.</div>
          </q-banner>

          <q-card-section class="bg-grey-2 row justify-between items-center header-border">
            <div class="text-h6 text-weight-bold">Standard Residential Lease</div>
            <StatusBadge :status="agreementData.status" />
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-uppercase text-grey-7 text-weight-bold q-mb-sm">Step 1: Review Terms</div>
            <div class="scroll terms-box bg-grey-1 q-pa-md rounded-borders">
              <p class="text-body1">
                <strong>1. Terms:</strong> This agreement commences on May 1st, 2026 and continues for a period of 12 months.<br><br>
                <strong>2. Rent:</strong> Tenant agrees to pay ৳ 15,000 per month, due on the 1st of every month.<br><br>
                <strong>3. Maintenance:</strong> Landlord is responsible for structural repairs. Tenant is responsible for basic upkeep of the premises. Tenant must notify management of any leaks immediately.<br><br>
                <strong>4. Utilities:</strong> Tenant is responsible for electricity and internet. Water and trash collection are included in the rent.<br><br>
                <strong>5. Termination:</strong> A 30-day written notice is required before vacating the property.
              </p>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pa-lg">
            <div class="text-subtitle2 text-uppercase text-grey-7 text-weight-bold q-mb-md">Step 2: Upload Required Documents</div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="text-caption text-weight-bold q-mb-xs">Signed Agreement (PDF/Word) *</div>
                <q-uploader
                  ref="docUploaderRef"
                  url="/api/mock/upload"
                  color="primary"
                  flat
                  bordered
                  accept=".pdf, .doc, .docx"
                  class="full-width custom-uploader"
                  hide-upload-btn
                  @added="onDocAdded"
                  @removed="onDocRemoved"
                />
              </div>

              <div class="col-12 col-md-6">
                <div class="text-caption text-weight-bold q-mb-xs">Government ID / Photo Proof *</div>
                <q-uploader
                  ref="imgUploaderRef"
                  url="/api/mock/upload"
                  color="secondary"
                  flat
                  bordered
                  accept="image/*, .pdf"
                  class="full-width custom-uploader"
                  hide-upload-btn
                  @added="onImgAdded"
                  @removed="onImgRemoved"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pa-lg bg-grey-1">
            <q-checkbox
              v-model="agreed"
              color="primary"
              class="text-weight-medium"
              label="I acknowledge that I have read the terms and that the uploaded documents are authentic."
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                color="primary"
                label="Submit Application"
                icon-right="send"
                unelevated
                padding="10px 24px"
                class="text-weight-bold"
                :disable="!agreed"
                :loading="isSubmitting"
                @click="submitAgreement"
              />
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

// --- State Variables ---
const isLoading = ref(true)
const isSubmitting = ref(false)
const agreed = ref(false)

// Uploader Refs & Files
const docUploaderRef = ref(null)
const imgUploaderRef = ref(null)
const uploadedDoc = ref(null)
const uploadedImg = ref(null)

// Holds the tenant's current agreement status
const agreementData = ref({
  status: 'pending', // 'pending', 'reviewing', 'active', 'rejected'
  docName: null,
  imgName: null
})

// Local Storage Key (specific to this tenant's view)
const TENANT_STORAGE_KEY = 'tenant_my_agreement_status'

// --- Lifecycle ---
onMounted(() => {
  fetchMyAgreement()
})

const fetchMyAgreement = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace with axios.get('/api/tenant/my-agreement')
  setTimeout(() => {
    const savedData = localStorage.getItem(TENANT_STORAGE_KEY)
    if (savedData) {
      agreementData.value = JSON.parse(savedData)
    }
    isLoading.value = false
  }, 600) // Simulated network delay
}

// --- Uploader Handlers ---
const onDocAdded = (files) => { uploadedDoc.value = files[0] }
const onDocRemoved = () => { uploadedDoc.value = null }

const onImgAdded = (files) => { uploadedImg.value = files[0] }
const onImgRemoved = () => { uploadedImg.value = null }

// --- Submit Method ---
const submitAgreement = () => {
  // Validation
  if (!uploadedDoc.value) {
    $q.notify({ type: 'warning', message: 'Please upload the Signed Agreement document.', position: 'top-right' })
    return
  }
  if (!uploadedImg.value) {
    $q.notify({ type: 'warning', message: 'Please upload your Government ID image or PDF.', position: 'top-right' })
    return
  }

  isSubmitting.value = true

  // INTEGRATION POINT: Use FormData for Axios upload
  // const formData = new FormData()
  // formData.append('document', uploadedDoc.value)
  // formData.append('image', uploadedImg.value)
  // axios.post('/api/tenant/submit-agreement', formData).then(...)

  setTimeout(() => {
    // Update local state
    agreementData.value = {
      status: 'reviewing',
      docName: uploadedDoc.value.name,
      imgName: uploadedImg.value.name
    }

    // Save to Local Storage so status persists on refresh
    localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(agreementData.value))

    $q.notify({
      type: 'positive',
      message: 'Agreement submitted successfully! Waiting for admin approval.',
      position: 'top-right'
    })

    isSubmitting.value = false
  }, 1200) // Simulate upload processing time
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.rounded-borders {
  border-radius: 12px;
}
.header-border {
  border-bottom: 1px solid #e0e0e0;
}
.terms-box {
  height: 250px;
  border: 1px solid #e0e0e0;
}

/* Ensure the uploaders look neat and take full width of their columns */
.custom-uploader {
  max-height: 200px;
}
</style>
