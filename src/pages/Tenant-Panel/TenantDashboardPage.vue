<template>
  <q-page padding class="bg-grey-1 flex justify-center">
    <div class="full-width" style="max-width: 1000px;">

      <div class="row items-center justify-between q-mb-xl q-mt-sm">
        <div>
          <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">
            Welcome back, {{ tenantName }}! 👋
          </h4>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">Here is your tenancy overview for today.</div>
        </div>
        <q-btn
          color="primary"
          icon="refresh"
          outline
          class="text-weight-bold bg-white q-mt-md q-mt-sm-none"
          padding="8px 16px"
          @click="fetchDashboardData"
        >
          <q-tooltip>Refresh Data</q-tooltip>
        </q-btn>
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else>
        <div class="row q-col-gutter-lg q-mb-xl">

          <div class="col-12 col-md-4">
            <q-card bordered class="dashboard-card bg-primary text-white shadow-3 relative-position overflow-hidden">
              <div class="card-decor bg-white opacity-10"></div>

              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle1 text-weight-medium text-blue-2 text-uppercase">Next Rent Due</div>
                  <q-icon name="account_balance_wallet" size="md" color="blue-2" />
                </div>
                <div class="text-h3 text-weight-bolder">৳ {{ formatAmt(nextRentAmount) }}</div>
                <div class="text-subtitle2 q-mt-sm text-blue-1">
                  <q-icon name="event" size="xs" class="q-mr-xs" /> Due on: {{ nextRentDate }}
                </div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="right" class="q-px-md q-py-sm bg-dark-overlay">
                <q-btn flat color="white" class="text-weight-bold" label="Pay Now" icon-right="arrow_forward" to="/tenant/rent-records" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card bordered class="dashboard-card bg-info text-white shadow-3 relative-position overflow-hidden">
              <div class="card-decor bg-white opacity-10"></div>

              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle1 text-weight-medium text-cyan-2 text-uppercase">Recent Notices</div>
                  <q-icon name="campaign" size="md" color="cyan-2" />
                </div>
                <div class="text-h3 text-weight-bolder">{{ noticeCount }}</div>
                <div class="text-subtitle2 q-mt-sm text-cyan-1">
                  Important building updates
                </div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="right" class="q-px-md q-py-sm bg-dark-overlay">
                <q-btn flat color="white" class="text-weight-bold" label="View Board" icon-right="arrow_forward" to="/tenant/notices" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card bordered class="dashboard-card bg-orange-9 text-white shadow-3 relative-position overflow-hidden">
              <div class="card-decor bg-white opacity-10"></div>

              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle1 text-weight-medium text-orange-2 text-uppercase">Open Requests</div>
                  <q-icon name="build" size="md" color="orange-2" />
                </div>
                <div class="text-h3 text-weight-bolder">{{ openRequestCount }}</div>
                <div class="text-subtitle2 q-mt-sm text-orange-1">
                  Active maintenance tickets
                </div>
              </q-card-section>
              <q-separator dark />
              <q-card-actions align="right" class="q-px-md q-py-sm bg-dark-overlay">
                <q-btn flat color="white" class="text-weight-bold" label="Track Status" icon-right="arrow_forward" to="/tenant/complaints" />
              </q-card-actions>
            </q-card>
          </div>

        </div>

        <div class="q-mb-md">
          <h5 class="text-h6 text-weight-bold text-dark q-my-none">Quick Shortcuts</h5>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-6 col-md-3">
            <q-btn
              unelevated
              color="white"
              text-color="primary"
              class="full-width q-pa-md shadow-1 rounded-borders shortcut-btn column flex-center"
              to="/tenant/complaints"
            >
              <q-icon name="home_repair_service" size="lg" class="q-mb-sm" />
              <div class="text-weight-bold">Report Issue</div>
            </q-btn>
          </div>
          <div class="col-6 col-md-3">
            <q-btn
              unelevated
              color="white"
              text-color="positive"
              class="full-width q-pa-md shadow-1 rounded-borders shortcut-btn column flex-center"
              to="/tenant/rent-records"
            >
              <q-icon name="payments" size="lg" class="q-mb-sm" />
              <div class="text-weight-bold">Pay Rent</div>
            </q-btn>
          </div>
          <div class="col-6 col-md-3">
            <q-btn
              unelevated
              color="white"
              text-color="info"
              class="full-width q-pa-md shadow-1 rounded-borders shortcut-btn column flex-center"
              to="/tenant/messages"
            >
              <q-icon name="chat" size="lg" class="q-mb-sm" />
              <div class="text-weight-bold">Message Admin</div>
            </q-btn>
          </div>
          <div class="col-6 col-md-3">
            <q-btn
              unelevated
              color="white"
              text-color="grey-8"
              class="full-width q-pa-md shadow-1 rounded-borders shortcut-btn column flex-center"
              to="/tenant/profile"
            >
              <q-icon name="manage_accounts" size="lg" class="q-mb-sm" />
              <div class="text-weight-bold">My Profile</div>
            </q-btn>
          </div>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- State ---
const isLoading = ref(true)

// Dashboard Data
const tenantName = ref('Tenant')
const nextRentAmount = ref(0)
const nextRentDate = ref('N/A')
const noticeCount = ref(0)
const openRequestCount = ref(0)

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchDashboardData()
})

const fetchDashboardData = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenant/dashboard')
  setTimeout(() => {

    // 1. Fetch Profile Data (for name)
    const profileData = JSON.parse(localStorage.getItem('tenant_personal_profile'))
    if (profileData && profileData.firstName) {
      tenantName.value = profileData.firstName
    } else {
      tenantName.value = 'Mitali' // Default fallback
    }

    // 2. Fetch Invoice Data (for rent due)
    const invoiceData = JSON.parse(localStorage.getItem('tenant_invoice_records'))
    if (invoiceData && invoiceData.length > 0) {
      const pendingInvoices = invoiceData.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      if (pendingInvoices.length > 0) {
        // Sort to find nearest due date
        pendingInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        nextRentAmount.value = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
        nextRentDate.value = new Date(pendingInvoices[0].dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      } else {
        nextRentAmount.value = 0
        nextRentDate.value = 'All Caught Up!'
      }
    } else {
      nextRentAmount.value = 15000 // Default mock
      nextRentDate.value = 'May 1, 2026'
    }

    // 3. Fetch Notices
    const noticesData = JSON.parse(localStorage.getItem('house_rent_notices'))
    if (noticesData) {
      noticeCount.value = noticesData.length
    } else {
      noticeCount.value = 2 // Default mock
    }

    // 4. Fetch Maintenance Requests
    const maintenanceData = JSON.parse(localStorage.getItem('tenant_maintenance_requests'))
    if (maintenanceData) {
      openRequestCount.value = maintenanceData.filter(req => req.status === 'open' || req.status === 'in_progress').length
    } else {
      openRequestCount.value = 1 // Default mock
    }

    isLoading.value = false
  }, 600) // Simulated network delay
}

// --- Helper Functions ---
const formatAmt = (num) => num ? Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'

</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}

.rounded-borders {
  border-radius: 12px;
}

.dashboard-card {
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
}

.bg-dark-overlay {
  background: rgba(0, 0, 0, 0.1);
}

.opacity-10 {
  opacity: 0.1;
}

/* Decorative circle background for cards */
.card-decor {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: -30px;
  right: -30px;
  pointer-events: none;
}

.shortcut-btn {
  height: 120px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.shortcut-btn:hover {
  border-color: var(--q-primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
</style>
