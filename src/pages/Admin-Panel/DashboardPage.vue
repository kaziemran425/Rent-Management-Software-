<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Management Dashboard</div>
        <div class="text-subtitle1 text-grey-7">Real-time overview of your rental properties</div>
      </div>
      <div class="row q-gutter-sm">
        <q-btn outline color="indigo-9" icon="calendar_today" label="Last 30 Days" class="bg-white" />
        <q-btn color="indigo-9" icon="download" label="Download Report" unelevated />
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div v-for="stat in summaryStats" :key="stat.title" class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="dashboard-card bg-white">
          <q-card-section>
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-subtitle2 text-grey-6 text-weight-bold text-uppercase tracking-wide">
                  {{ stat.title }}
                </div>
                <div class="text-h4 text-bold text-grey-9 q-mt-sm">{{ stat.value }}</div>
              </div>
              <div class="icon-box flex flex-center" :class="stat.bgClass">
                <q-icon :name="stat.icon" :color="stat.color" size="32px" />
              </div>
            </div>
            
            <div class="q-mt-md flex items-center">
              <q-badge 
                rounded 
                :color="stat.trendUp ? 'positive' : 'negative'" 
                class="q-px-sm q-py-xs"
                transparent
              >
                <q-icon :name="stat.trendUp ? 'trending_up' : 'trending_down'" size="xs" class="q-mr-xs" />
                <span class="text-bold">{{ stat.percentage }}%</span>
              </q-badge>
              <span class="text-grey-6 q-ml-sm text-caption text-weight-medium">vs last month</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="dashboard-card bg-white" style="height: 100%">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-bold text-grey-9">Revenue vs Expenses</div>
            <q-space />
            <q-btn-toggle
              v-model="chartView"
              flat
              dense
              toggle-color="indigo-9"
              color="grey-6"
              :options="[{label: 'Weekly', value: 'w'}, {label: 'Monthly', value: 'm'}]"
              class="bg-grey-2"
            />
          </q-card-section>
          <q-card-section>
            <apexchart 
              type="area" 
              height="350" 
              :options="revenueChartOptions" 
              :series="revenueSeries" 
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="dashboard-card bg-white" style="height: 100%">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-bold text-grey-9">Unit Status</div>
          </q-card-section>
          <q-card-section class="flex flex-center">
            <apexchart 
              type="donut" 
              width="320" 
              :options="donutOptions" 
              :series="donutSeries" 
            />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-list dense class="q-mt-sm">
              <q-item v-for="item in unitLegend" :key="item.label" class="q-px-none">
                <q-item-section avatar min-width="30px">
                  <q-icon name="circle" :color="item.color" size="14px" />
                </q-item-section>
                <q-item-section class="text-grey-8 text-weight-medium">{{ item.label }}</q-item-section>
                <q-item-section side class="text-bold text-grey-9">{{ item.count }} Units</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <q-card flat bordered class="dashboard-card bg-white">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-bold text-grey-9">Recent Rent Collections</div>
          </q-card-section>
          <q-card-section>
            <q-table
              :rows="recentCollections"
              :columns="tableColumns"
              row-key="id"
              flat
              hide-bottom
              class="bg-transparent"
              :pagination="{ rowsPerPage: 5 }"
            >
              <template v-slot:body-cell-tenant="props">
                <q-td :props="props" class="row items-center no-wrap">
                  <q-avatar size="32px" color="indigo-1" text-color="indigo-9" class="q-mr-sm text-bold">
                    {{ props.row.tenant.charAt(0) }}
                  </q-avatar>
                  <span class="text-weight-bold text-grey-9">{{ props.value }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip 
                    :color="props.value === 'Confirmed' ? 'positive' : 'warning'" 
                    :text-color="props.value === 'Confirmed' ? 'white' : 'dark'"
                    size="sm"
                    class="text-bold"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-amount="props">
                <q-td :props="props" class="text-bold text-grey-9">
                  {{ props.value }}
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Register ApexCharts locally
const apexchart = VueApexCharts

const chartView = ref('m')

// --- Summary Stats Data ---
const summaryStats = [
  { title: 'Total Revenue', value: '৳ 4.2M', icon: 'payments', color: 'indigo-9', bgClass: 'bg-indigo-1', trendUp: true, percentage: '12' },
  { title: 'Active Tenants', value: '142', icon: 'people', color: 'blue-8', bgClass: 'bg-blue-1', trendUp: true, percentage: '4' },
  { title: 'Vacant Units', value: '08', icon: 'meeting_room', color: 'orange-9', bgClass: 'bg-orange-1', trendUp: false, percentage: '2' },
  { title: 'Pending Dues', value: '৳ 85k', icon: 'history_edu', color: 'negative', bgClass: 'bg-red-1', trendUp: false, percentage: '1.5' }
]

// --- Advanced Revenue Area Chart Options ---
const revenueSeries = [
  { name: 'Income', data: [31000, 40000, 28000, 51000, 42000, 109000, 100000] },
  { name: 'Expenses', data: [11000, 32000, 45000, 32000, 34000, 52000, 41000] }
]

const revenueChartOptions = {
  chart: { 
    toolbar: { show: false }, 
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  colors: ['#283593', '#ef5350'], // Deep Indigo & Red
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  xaxis: { 
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      formatter: (value) => { return value >= 1000 ? (value / 1000) + "k" : value }
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4, // Dotted grid lines
  },
  tooltip: { 
    theme: 'light',
    y: { formatter: (val) => `৳ ${val.toLocaleString()}` } 
  },
  legend: { position: 'top', horizontalAlign: 'right' }
}

// --- Occupancy Donut Chart Options ---
const donutSeries = [142, 8, 5]
const donutOptions = {
  labels: ['Occupied', 'Vacant', 'Maintenance'],
  colors: ['#283593', '#4caf50', '#ff9800'],
  legend: { show: false },
  stroke: { show: false }, // Removes white borders for a seamless look
  plotOptions: { 
    pie: { 
      donut: { 
        size: '75%',
        labels: {
          show: true,
          name: { show: true },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total Units',
            fontSize: '14px',
            color: '#888'
          }
        }
      } 
    } 
  }
}

const unitLegend = [
  { label: 'Occupied', count: 142, color: 'indigo-9' },
  { label: 'Vacant', count: 8, color: 'positive' },
  { label: 'Maintenance', count: 5, color: 'orange' }
]

// --- Table Data ---
const tableColumns = [
  { name: 'tenant', label: 'Tenant Name', field: 'tenant', align: 'left' },
  { name: 'unit', label: 'Unit', field: 'unit', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'date', label: 'Date', field: 'date', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]

const recentCollections = [
  { id: 1, tenant: 'Kazi Emran', unit: 'B-402', amount: '৳ 12,500', date: '12 Apr 2026', status: 'Confirmed' },
  { id: 2, tenant: 'Arif Ahmed', unit: 'A-101', amount: '৳ 15,000', date: '12 Apr 2026', status: 'Pending' },
  { id: 3, tenant: 'Sultana Razia', unit: 'C-205', amount: '৳ 11,800', date: '11 Apr 2026', status: 'Confirmed' },
  { id: 4, tenant: 'Rohan Rahman', unit: 'A-302', amount: '৳ 14,000', date: '10 Apr 2026', status: 'Confirmed' },
]
</script>

<style scoped>
/* Dashboard Card Hover Effects */
.dashboard-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}

/* Custom Icon Box inside Summary Cards */
.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.tracking-wide {
  letter-spacing: 0.5px;
}
</style>