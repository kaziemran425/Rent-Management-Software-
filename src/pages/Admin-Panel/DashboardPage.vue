<template>
  <q-page padding class="bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Admin Dashboard</h4>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">Complete overview of your property metrics</div>
      </div>
      <q-btn color="primary" icon="refresh" outline label="Refresh" class="bg-white text-weight-bold" @click="fetchDashboardData" />
    </div>

    <div v-if="isLoading" class="flex flex-center q-pa-xl"><q-spinner color="primary" size="3em" /></div>

    <div v-else>
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card bordered class="shadow-2 bg-primary text-white q-pa-md rounded-borders">
            <div class="text-subtitle2 text-blue-2 text-uppercase text-weight-bold">Total Tenants</div>
            <div class="text-h3 text-weight-bold">{{ stats.tenants }}</div>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card bordered class="shadow-2 bg-warning text-dark q-pa-md rounded-borders">
            <div class="text-subtitle2 text-orange-10 text-uppercase text-weight-bold">Pending Invoices</div>
            <div class="text-h3 text-weight-bold">{{ stats.pendingInvoices }}</div>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card bordered class="shadow-2 bg-negative text-white q-pa-md rounded-borders">
            <div class="text-subtitle2 text-red-2 text-uppercase text-weight-bold">Open Complaints</div>
            <div class="text-h3 text-weight-bold">{{ stats.openComplaints }}</div>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card bordered class="shadow-2 bg-info text-white q-pa-md rounded-borders">
            <div class="text-subtitle2 text-cyan-2 text-uppercase text-weight-bold">Agreements to Review</div>
            <div class="text-h3 text-weight-bold">{{ stats.reviewAgreements }}</div>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-card flat bordered class="shadow-1 bg-white rounded-borders">
            <q-card-section class="bg-grey-2 border-bottom">
              <div class="text-h6 text-weight-bold text-dark">Recent Maintenance Requests</div>
            </q-card-section>

            <q-list separator>
              <q-item v-if="recentComplaints.length === 0" class="q-pa-lg text-center text-grey">
                <q-item-section>No active maintenance requests.</q-item-section>
              </q-item>

              <q-item v-for="req in recentComplaints" :key="req.id" class="q-pa-md" clickable to="/admin/maintenance">
                <q-item-section avatar>
                  <q-icon name="build" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ req.title }}</q-item-label>
                  <q-item-label caption>Reported by: {{ req.tenant }} | Unit: {{ req.flat }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="negative">{{ req.status.toUpperCase() }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card flat bordered class="shadow-1 bg-white rounded-borders">
            <q-card-section class="bg-grey-2 border-bottom">
              <div class="text-h6 text-weight-bold text-dark">Quick Actions</div>
            </q-card-section>

            <q-card-section class="row q-gutter-md justify-center q-pa-lg">
              <q-btn color="primary" icon="receipt" label="New Invoice" stack unelevated class="col-5 q-pa-md text-weight-bold rounded-borders" to="/admin/invoices" />
              <q-btn color="info" icon="campaign" label="Post Notice" stack unelevated class="col-5 q-pa-md text-weight-bold rounded-borders" to="/admin/notices" />
              <q-btn color="positive" icon="person_add" label="Add Tenant" stack unelevated class="col-5 q-pa-md text-weight-bold rounded-borders" to="/admin/tenants" />
              <q-btn color="warning" text-color="dark" icon="chat" label="Messages" stack unelevated class="col-5 q-pa-md text-weight-bold rounded-borders" to="/admin/messages" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const stats = ref({ tenants: 0, pendingInvoices: 0, openComplaints: 0, reviewAgreements: 0 })
const recentComplaints = ref([])

const fetchDashboardData = () => {
  isLoading.value = true
  setTimeout(() => {
    // 1. Pull data from all interconnected parts of the system
    const tenants = JSON.parse(localStorage.getItem('house_rent_tenants') || '[]')
    const invoices = JSON.parse(localStorage.getItem('tenant_invoice_records') || '[]')
    const complaints = JSON.parse(localStorage.getItem('tenant_maintenance_requests') || '[]')
    const agreements = JSON.parse(localStorage.getItem('house_rent_agreements') || '[]')

    // 2. Aggregate counts for the top KPI cards
    stats.value.tenants = tenants.length
    stats.value.pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length
    stats.value.openComplaints = complaints.filter(c => c.status === 'open').length
    stats.value.reviewAgreements = agreements.filter(a => a.status === 'reviewing').length

    // 3. Get the latest open complaints for the list view
    recentComplaints.value = complaints.filter(c => c.status === 'open').slice(0, 4)

    isLoading.value = false
  }, 600)
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.tracking-tight { letter-spacing: -0.02em; }
.rounded-borders { border-radius: 12px; }
.border-bottom { border-bottom: 1px solid #eeeeee; }
</style>
