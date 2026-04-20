<template>
  <q-page padding class="bg-grey-1 flex flex-center">
    <div class="full-width" style="max-width: 850px;">

      <div class="text-center q-mb-xl">
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none">Lease Agreement & KYC</h4>
        <div class="text-subtitle1 text-grey-7">Review terms and securely submit your identity documents</div>
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else>

        <q-card v-if="agreement.status === 'reviewing'" flat bordered class="text-center q-pa-xl bg-white shadow-1 rounded-borders">
          <q-icon name="hourglass_empty" size="60px" color="info" class="q-mb-md" />
          <h5 class="text-h5 text-weight-bold text-dark">Under Review</h5>
          <p class="text-grey-7">Your agreement and documents are currently being reviewed by the Admin.</p>

          <div class="q-mt-lg row justify-center q-gutter-md">
            <q-chip color="blue-1" text-color="primary" icon="description">Documents Submitted</q-chip>
            <q-chip color="blue-1" text-color="primary" icon="verified_user">Terms Accepted</q-chip>
          </div>
        </q-card>

        <q-card v-else-if="agreement.status === 'active'" flat bordered class="text-center q-pa-xl bg-green-1 shadow-1 rounded-borders">
          <q-icon name="verified" size="60px" color="positive" class="q-mb-md" />
          <h5 class="text-h5 text-weight-bold text-positive">Agreement Approved</h5>
          <p class="text-green-9">Welcome! Your lease is now active and your documents are verified.</p>
        </q-card>

        <q-card v-else-if="agreement.status === 'rejected'" flat bordered class="text-center q-pa-xl bg-red-1 shadow-1 rounded-borders">
          <q-icon name="cancel" size="60px" color="negative" class="q-mb-md" />
          <h5 class="text-h5 text-weight-bold text-negative">Agreement Rejected</h5>
          <p class="text-red-9">There was an issue with your documents or agreement. Please review and submit again.</p>
          <q-btn color="negative" outline label="Submit Again" @click="resetAgreement" class="q-mt-md text-weight-bold" />
        </q-card>

        <q-card v-else flat bordered class="shadow-2 rounded-borders bg-white">

          <q-card-section class="bg-grey-2 border-bottom">
            <div class="text-h6 text-weight-bold text-dark">1. Standard Residential Lease Terms</div>
          </q-card-section>

          <q-card-section class="q-pa-lg scroll" style="max-height: 250px; background: #fafafa; border-bottom: 1px solid #eee;">
            <p><strong>1. Rent and Payments:</strong> Rent is due on the 1st of every month. Late fees apply after the 5th.</p>
            <p><strong>2. Maintenance:</strong> Tenant must report any damages or leaks via the portal immediately. Unauthorized repairs will not be reimbursed.</p>
            <p><strong>3. Use of Property:</strong> The premises are strictly for residential use. No commercial activities allowed.</p>
            <p><strong>4. Notice Period:</strong> A 60-day written notice is required before vacating the property.</p>
            <p><strong>5. Subletting:</strong> Subletting any part of the flat is strictly prohibited without written admin consent.</p>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-weight-bold text-dark q-mb-md">2. Identity Verification (KYC)</div>
            <div class="text-caption text-grey-7 q-mb-lg">
              Please upload clear images of your National ID (Front & Back merged or just Front) and a recent passport-sized photo.
              <br><strong class="text-negative">Note: Files must be images and less than 2MB each.</strong>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-uploader
                  label="Upload NID (Image Only)"
                  accept="image/*"
                  max-file-size="2097152"
                  auto-upload
                  hide-upload-btn
                  :factory="(files) => handleUploaderAdded(files, 'nid')"
                  @removed="() => handleUploaderRemoved('nid')"
                  @rejected="onRejected"
                  color="primary"
                  class="full-width q-uploader-custom"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-icon name="badge" size="sm" />
                      <div class="text-weight-bold text-subtitle2">National ID</div>
                      <q-space />
                      <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>
              </div>

              <div class="col-12 col-md-6">
                <q-uploader
                  label="Recent Photo (Image Only)"
                  accept="image/*"
                  max-file-size="2097152"
                  auto-upload
                  hide-upload-btn
                  :factory="(files) => handleUploaderAdded(files, 'photo')"
                  @removed="() => handleUploaderRemoved('photo')"
                  @rejected="onRejected"
                  color="info"
                  class="full-width q-uploader-custom"
                >
                  <template v-slot:header="scope">
                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                      <q-icon name="portrait" size="sm" />
                      <div class="text-weight-bold text-subtitle2">Recent Photo</div>
                      <q-space />
                      <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                        <q-tooltip>Pick Files</q-tooltip>
                      </q-btn>
                    </div>
                  </template>
                </q-uploader>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg bg-grey-1">
            <q-checkbox
              v-model="agreed"
              label="I have read, understood, and agree to the Lease Terms, and confirm that the uploaded documents are authentic."
              color="primary"
              class="text-weight-medium text-dark"
            />

            <div class="q-mt-xl text-right">
              <q-btn
                color="primary"
                label="Submit Agreement & Documents"
                icon-right="send"
                unelevated
                size="md"
                class="text-weight-bold q-px-lg"
                :disable="!canSubmit"
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isLoading = ref(true)
const isSubmitting = ref(false)
const agreed = ref(false)

// Storage for Base64 Strings of the uploaded files
const docData = reactive({
  nid: null,
  photo: null
})

// Bridge Key and Mock User
const LOCAL_STORAGE_KEY = 'house_rent_agreements'
const agreement = ref({ status: 'pending' })

// MOCK USER DATA (In a real app, this comes from the Auth Session)
const tenantId = 'TENANT-001'
const tenantName = 'Kazi Emran'

// Compute if the form can be submitted (must check terms AND have both files)
const canSubmit = computed(() => {
  return agreed.value && docData.nid !== null && docData.photo !== null
})

// --- Lifecycle & Data Fetching ---
const fetchAgreement = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    const allAgreements = JSON.parse(saved)
    const myAgreement = allAgreements.find(a => a.tenantId === tenantId)
    if (myAgreement) {
      agreement.value = myAgreement
    }
  }
  isLoading.value = false
}

onMounted(() => {
  fetchAgreement()
  window.addEventListener('storage', fetchAgreement) // Listen to Admin actions (Approval/Rejection)
})

onUnmounted(() => window.removeEventListener('storage', fetchAgreement))

// --- Uploader Handlers ---

// Reject Handler (Triggered if file is too big or wrong type)
const onRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints (Make sure it's an image under 2MB).`,
    position: 'top-right'
  })
}

// Custom Factory function to intercept the upload and convert to Base64 instead of sending to a server
const handleUploaderAdded = (files, docType) => {
  const file = files[0] // We only care about the first file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      docData[docType] = e.target.result // Save the Base64 string
      // Resolve the promise to tell q-uploader the "upload" is complete
      resolve({ url: 'local_storage_simulated' })
    }
    reader.readAsDataURL(file)
  })
}

// When user clicks the "Trash" icon on the uploader
const handleUploaderRemoved = (docType) => {
  docData[docType] = null
}

// --- Submit Function ---
const submitAgreement = () => {
  isSubmitting.value = true

  setTimeout(() => {
    let allAgreements = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')

    const newAgreement = {
      id: `AGR-${Date.now()}`,
      tenantId: tenantId,
      name: tenantName,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'reviewing',
      documents: {
        nid: docData.nid,
        photo: docData.photo
      }
    }

    // Update existing or push new
    const index = allAgreements.findIndex(a => a.tenantId === tenantId)
    if (index > -1) {
      allAgreements[index] = newAgreement
    } else {
      allAgreements.unshift(newAgreement)
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allAgreements))

    agreement.value = newAgreement
    isSubmitting.value = false

    $q.notify({
      type: 'positive',
      message: 'Agreement and documents submitted for Admin review.',
      position: 'top-right'
    })
  }, 1200) // Simulated processing time
}

// --- Reset for Resubmission ---
const resetAgreement = () => {
  agreement.value = { status: 'pending' }
  agreed.value = false
  docData.nid = null
  docData.photo = null
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.rounded-borders {
  border-radius: 12px;
}
/* Customizing the uploader to look a bit more modern */
.q-uploader-custom {
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}
</style>
