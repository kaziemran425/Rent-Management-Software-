<template>
  <q-page padding class="bg-grey-1 flex justify-center">
    <div class="full-width" style="max-width: 1000px;">

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else>
        <div class="row items-center justify-between q-mb-xl q-mt-sm">
          <div>
            <div class="text-h4 text-weight-bolder text-dark tracking-tight">
              Welcome Back, {{ tenantProfile.firstName }} 👋
            </div>
            <div class="text-subtitle1 text-grey-7 q-mt-xs">
              <q-icon name="meeting_room" class="q-mr-xs" /> Unit: {{ tenantProfile.assignedUnit }}
            </div>
          </div>
          <q-btn
            color="primary"
            icon="payments"
            label="Pay Rent Now"
            unelevated
            class="text-weight-bold shadow-2 q-mt-md q-mt-sm-none"
            padding="8px 20px"
            to="/tenant/rent-records"
          />
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">

          <div class="col-12 col-md-4">
            <q-card bordered class="dashboard-card bg-primary text-white shadow-3 relative-position overflow-hidden">
              <div class="card-decor bg-white opacity-10"></div>
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle2 text-blue-2 text-uppercase text-weight-bold">Current Amount Due</div>
                  <q-icon name="account_balance_wallet" size="md" color="blue-2" />
                </div>
                <div class="text-h3 text-weight-bolder">৳ {{ formatAmt(rentStatus.amount) }}</div>
                <div class="text-caption text-blue-1 q-mt-sm text-weight-medium">
                  <q-icon name="event" class="q-mr-xs"/> Due by: {{ rentStatus.dueDate }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card bordered class="dashboard-card bg-white shadow-2 relative-position overflow-hidden">
              <div class="card-decor bg-orange-1 opacity-50"></div>
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Active Support Tickets</div>
                  <q-icon name="engineering" size="md" color="orange-9" />
                </div>
                <div class="text-h3 text-weight-bolder text-orange-9">{{ activeTicketsCount }}</div>
                <div class="text-caption text-grey-6 q-mt-sm text-weight-medium">
                  <q-icon name="info" class="q-mr-xs"/> Open or In Progress
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card bordered class="dashboard-card bg-white shadow-2 relative-position overflow-hidden">
              <div class="card-decor bg-blue-1 opacity-50"></div>
              <q-card-section class="q-pa-lg">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Next Lease Renewal</div>
                  <q-icon name="description" size="md" color="primary" />
                </div>
                <div class="text-h3 text-weight-bolder text-dark">{{ leaseInfo.renewalMonth }}</div>
                <div class="text-caption text-grey-6 q-mt-sm text-weight-medium">
                  <q-icon name="update" class="q-mr-xs"/> {{ leaseInfo.monthsRemaining }} Months Remaining
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <q-card flat bordered class="shadow-1 rounded-borders bg-white">
              <q-card-section class="bg-grey-1 row items-center justify-between header-border">
                <div class="row items-center">
                  <q-avatar size="36px" color="blue-1" text-color="primary" class="q-mr-sm">
                    <q-icon name="campaign" size="20px" />
                  </q-avatar>
                  <div class="text-h6 text-weight-bold text-dark">Building Announcements</div>
                </div>
                <q-btn flat color="primary" label="View All" to="/tenant/notices" class="text-weight-bold" />
              </q-card-section>

              <q-list separator>
                <q-item v-if="notices.length === 0" class="q-pa-lg flex flex-center text-grey-6">
                  <div class="text-center">
                    <q-icon name="notifications_paused" size="40px" color="grey-4" class="q-mb-sm" />
                    <div>No recent announcements.</div>
                  </div>
                </q-item>

                <q-item
                  v-for="notice in notices.slice(0, 3)"
                  :key="notice.id"
                  class="q-pa-md notice-item"
                  clickable
                  v-ripple
                  to="/tenant/notices"
                >
                  <q-item-section avatar top>
                    <q-avatar
                      :color="notice.urgent ? 'red-1' : 'grey-2'"
                      :text-color="notice.urgent ? 'negative' : 'grey-7'"
                      :icon="notice.urgent ? 'warning' : 'notifications'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark text-body1 row items-center">
                      {{ notice.title }}
                      <q-badge v-if="notice.urgent" color="negative" class="q-ml-sm" label="Urgent" />
                    </q-item-label>
                    <q-item-label caption lines="2" class="q-mt-xs text-grey-7">
                      {{ notice.content }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption class="text-weight-bold text-primary">{{ notice.date }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- State Variables ---
const isLoading = ref(true)

const tenantProfile = ref({ firstName: 'Tenant', assignedUnit: 'Unassigned' })
const rentStatus = ref({ amount: 0, dueDate: 'All Caught Up!' })
const activeTicketsCount = ref(0)
const leaseInfo = ref({ renewalMonth: 'N/A', monthsRemaining: 0 })
const notices = ref([])

// --- Lifecycle & API Readiness ---
onMounted(() => {
  fetchDashboardData()
})

const fetchDashboardData = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenant/dashboard')
  setTimeout(() => {

    // 1. Fetch Profile Data
    const savedProfile = localStorage.getItem('tenant_personal_profile')
    if (savedProfile) {
      const p = JSON.parse(savedProfile)
      tenantProfile.value.firstName = p.firstName || 'Kazi Emran'
      tenantProfile.value.assignedUnit = p.assignedUnit || 'A-101 | Green Valley Residency'
    } else {
      tenantProfile.value = { firstName: 'Kazi Emran', assignedUnit: 'A-101 | Green Valley Residency' }
    }

    // 2. Fetch Rent & Invoice Data
    const savedInvoices = localStorage.getItem('tenant_invoice_records')
    if (savedInvoices) {
      const invoices = JSON.parse(savedInvoices)
      const pending = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      if (pending.length > 0) {
        pending.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        rentStatus.value.amount = pending.reduce((sum, inv) => sum + inv.amount, 0)
        rentStatus.value.dueDate = new Date(pending[0].dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      } else {
        rentStatus.value = { amount: 0, dueDate: 'Paid in full' }
      }
    } else {
      rentStatus.value = { amount: 14500, dueDate: '05 May 2026' } // Default mock
    }

    // 3. Fetch Maintenance Tickets
    const savedTickets = localStorage.getItem('tenant_maintenance_requests')
    if (savedTickets) {
      const tickets = JSON.parse(savedTickets)
      activeTicketsCount.value = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length
    } else {
      activeTicketsCount.value = 1 // Default mock
    }

    // 4. Mock Lease Renewal Calculation (Assuming 1 year from May 2025)
    // In a real app, this date comes from the backend lease agreement data
    leaseInfo.value = { renewalMonth: 'Dec 2026', monthsRemaining: 8 }

    // 5. Fetch Notices
    const savedNotices = localStorage.getItem('house_rent_notices')
    if (savedNotices) {
      notices.value = JSON.parse(savedNotices)
      // Sort newest first
      notices.value.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      notices.value = [
        { id: 1, date: 'April 14, 2026', title: 'Water Tank Cleaning Tomorrow', content: 'Water supply will be paused from 10 AM to 2 PM.', urgent: true },
        { id: 2, date: 'April 01, 2026', title: 'Welcome to the New Portal', content: 'You can now pay rent and submit complaints online.', urgent: false }
      ]
    }

    isLoading.value = false
  }, 600) // Simulated network delay
}

// --- Helper Functions ---
const formatAmt = (num) => num ? Number(num).toLocaleString(undefined, { minimumFractionDigits: 0 }) : '0'

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
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}

.header-border {
  border-bottom: 1px solid #e0e0e0;
}

.notice-item {
  transition: background 0.2s ease;
}
.notice-item:hover {
  background: #f8f9fa;
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

.opacity-10 { opacity: 0.1; }
.opacity-50 { opacity: 0.5; }
</style>
