<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-bold text-indigo-9">Billing & Invoices</div>
        <div class="text-subtitle1 text-grey-7">
          Manage tenant bills and track payments
        </div>
      </div>
      <q-btn
        color="indigo-9"
        icon="receipt_long"
        label="Create Invoice"
        size="md"
        unelevated
        @click="openAddDialog"
      />
    </div>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">
              Total Invoiced (This Month)
            </div>
            <div class="text-h4 text-bold text-indigo-9 q-mt-sm">
              ৳ {{ totalInvoiced.toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-white">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7 text-uppercase text-bold">
              Collected Amount
            </div>
            <div class="text-h4 text-bold text-positive q-mt-sm">
              ৳ {{ totalCollected.toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered class="shadow-2 bg-indigo-9 text-white">
          <q-card-section>
            <div class="text-subtitle2 text-indigo-2 text-uppercase text-bold">
              Pending Dues
            </div>
            <div class="text-h4 text-bold text-orange-4 q-mt-sm">
              ৳ {{ totalPending.toLocaleString() }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="shadow-2">
      <q-table
        title="Recent Invoices"
        :rows="invoices"
        :columns="invCols"
        row-key="id"
        flat
        :filter="searchQuery"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="searchQuery"
            placeholder="Search Invoice..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.value === 'Paid' ? 'positive' : 'orange-9'"
              text-color="white"
              size="sm"
              class="text-bold"
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right" class="q-gutter-x-sm">
            <q-btn
              v-if="props.row.status === 'Pending'"
              flat
              round
              color="positive"
              icon="check_circle"
              size="sm"
              @click="markAsPaid(props.row)"
            >
              <q-tooltip>Mark as Paid</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="indigo-9"
              icon="print"
              size="sm"
              @click="openPrintPreview(props.row)"
            >
              <q-tooltip>Print Slip</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Delete Invoice</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 600px; max-width: 90vw">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-md">
          <div class="text-h6 text-weight-bold">Generate New Bill</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="saveInvoice" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  label="Select Tenant *"
                  :options="[
                    'Emran (A-101)',
                    'Arif (B-205)',
                    'Sultana (C-301)',
                  ]"
                  v-model="form.tenant"
                  :rules="[(val) => !!val || 'Tenant is required']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="month"
                  label="Billing Month *"
                  v-model="form.month"
                  :rules="[(val) => !!val || 'Month is required']"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />
            <div class="text-subtitle2 text-grey-7 q-mb-sm">
              Billing Details
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input outlined dense label="Base Rent (৳)" type="number" v-model="form.baseRent" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input outlined dense label="Electricity Bill (৳)" type="number" v-model="form.electricity" />
              </div>
              <div class="col-12 col-sm-4">
                <q-input outlined dense label="Gas/Water Fixed (৳)" type="number" v-model="form.utility" />
              </div>
            </div>

            <q-card flat class="bg-indigo-1 q-pa-md q-mt-md rounded-borders">
              <div class="row justify-between items-center">
                <div class="text-h6 text-indigo-9">Total Payable Amount:</div>
                <div class="text-h5 text-bold text-indigo-9">
                  ৳ {{ calculatedTotal.toLocaleString() }}
                </div>
              </div>
            </q-card>

            <div class="row justify-end q-mt-xl q-gutter-x-md">
              <q-btn label="CANCEL" color="grey-8" flat v-close-popup class="text-bold" />
              <q-btn
                label="GENERATE INVOICE"
                color="indigo-9"
                type="submit"
                unelevated
                class="text-bold"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPrintDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-3 q-pa-md flex flex-center">
        <div class="fixed-top row justify-between items-center bg-white q-pa-md shadow-2 no-print" style="z-index: 10;">
          <div class="text-h6">Invoice Preview</div>
          <div class="q-gutter-sm">
            <q-btn flat label="Close" v-close-popup color="grey-8" />
            <q-btn unelevated icon="print" label="Print / Save PDF" color="indigo-9" @click="executePrint" />
          </div>
        </div>

        <div id="printable-invoice" class="bg-white shadow-10" style="width: 800px; max-width: 100%; min-height: 1050px; margin-top: 60px;">
          
          <div class="bg-grey-10 text-white q-pa-xl row justify-between items-center" style="border-bottom: 8px solid #4caf50;">
            <div>
              <div class="text-h6 text-bold">Property Management BD</div>
              <div class="text-caption">123 Mirpur Road</div>
              <div class="text-caption">Dhaka, Bangladesh 1216</div>
              <div class="text-caption q-mt-xs">+880-1959-609090</div>
              <div class="text-caption">admin@propertymanagement.com</div>
            </div>
            <div class="text-h3 text-weight-light" style="letter-spacing: 2px;">
              INVOICE
            </div>
          </div>

          <div class="q-pa-xl row justify-between">
            <div>
              <div class="text-subtitle2 text-bold text-grey-8">INVOICE TO</div>
              <div class="text-body1 text-bold">{{ activeInvoice?.tenant }}</div>
              <div class="text-body2 text-grey-8">Billing Month: {{ activeInvoice?.month }}</div>
            </div>
            <div class="text-right">
              <div class="row justify-end q-gutter-x-md">
                <div class="text-bold text-grey-8">INVOICE #</div>
                <div class="text-bold">{{ activeInvoice?.id }}</div>
              </div>
              <div class="row justify-end q-gutter-x-md">
                <div class="text-bold text-grey-8">DATE</div>
                <div>{{ new Date().toLocaleDateString() }}</div>
              </div>
              <div class="row justify-end q-gutter-x-md">
                <div class="text-bold text-grey-8">TERMS</div>
                <div>Due on Receipt</div>
              </div>
            </div>
          </div>

          <div class="q-px-xl">
            <q-markup-table flat bordered>
              <thead class="bg-green text-white text-left">
                <tr>
                  <th class="text-subtitle2 text-bold">DESCRIPTION</th>
                  <th class="text-center text-subtitle2 text-bold">QTY</th>
                  <th class="text-right text-subtitle2 text-bold">RATE</th>
                  <th class="text-right text-subtitle2 text-bold">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="q-py-md">
                    <div class="text-bold">Base House Rent</div>
                    <div class="text-caption text-grey-7">Monthly residential unit rent</div>
                  </td>
                  <td class="text-center">1</td>
                  <td class="text-right">৳ {{ activeInvoice?.baseRent?.toLocaleString() }}</td>
                  <td class="text-right text-bold">৳ {{ activeInvoice?.baseRent?.toLocaleString() }}</td>
                </tr>
                <tr v-if="activeInvoice?.electricity > 0">
                  <td class="q-py-md">
                    <div class="text-bold">Electricity Bill</div>
                    <div class="text-caption text-grey-7">Meter reading usage</div>
                  </td>
                  <td class="text-center">1</td>
                  <td class="text-right">৳ {{ activeInvoice?.electricity?.toLocaleString() }}</td>
                  <td class="text-right text-bold">৳ {{ activeInvoice?.electricity?.toLocaleString() }}</td>
                </tr>
                <tr>
                  <td class="q-py-md">
                    <div class="text-bold">Utility / Service Charge</div>
                    <div class="text-caption text-grey-7">Gas, Water, and Building Maintenance</div>
                  </td>
                  <td class="text-center">1</td>
                  <td class="text-right">৳ {{ activeInvoice?.utility?.toLocaleString() }}</td>
                  <td class="text-right text-bold">৳ {{ activeInvoice?.utility?.toLocaleString() }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div class="q-pa-xl row justify-between">
            <div class="col-5">
              <div class="text-subtitle2 text-bold text-grey-8 q-mb-sm">MESSAGE</div>
              <q-card flat bordered class="q-pa-md bg-grey-1 text-grey-8">
                Thank you for your timely payment. Please ensure payments are made by the 5th of the month to avoid late fees.
              </q-card>
            </div>
            
            <div class="col-4 text-right">
              <div class="row justify-between q-py-xs">
                <div class="text-bold text-grey-8">SUBTOTAL</div>
                <div>৳ {{ activeInvoice?.total?.toLocaleString() }}</div>
              </div>
              <div class="row justify-between q-py-xs">
                <div class="text-bold text-grey-8">DISCOUNT</div>
                <div>৳ 0</div>
              </div>
              <q-separator class="q-my-sm" />
              <div class="row justify-between q-py-sm">
                <div class="text-h6 text-bold">BALANCE DUE</div>
                <div class="text-h6 text-bold text-indigo-9">৳ {{ activeInvoice?.total?.toLocaleString() }}</div>
              </div>
            </div>
          </div>
          
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

// --- UI State ---
const showDialog = ref(false);
const showPrintDialog = ref(false); // Controls the new Print Preview Dialog
const loading = ref(false);
const searchQuery = ref("");
const activeInvoice = ref(null); // Holds the data for the invoice being printed

// --- Table Configuration ---
const invCols = [
  { name: "id", label: "Invoice #", field: "id", align: "left", sortable: true },
  { name: "tenant", label: "Tenant", field: "tenant", align: "left", sortable: true },
  { name: "month", label: "Month", field: "month", align: "left", sortable: true },
  {
    name: "total",
    label: "Total Amount",
    field: "total",
    align: "center",
    sortable: true,
    format: (val) => `৳ ${Number(val).toLocaleString()}`,
  },
  { name: "status", label: "Status", field: "status", align: "center", sortable: true },
  { name: "actions", label: "Actions", align: "right" },
];

// --- Data State ---
const invoices = ref([]);

const form = reactive({
  tenant: null,
  month: "",
  baseRent: 12000,
  electricity: 0,
  utility: 1000,
  status: "Pending",
});

const calculatedTotal = computed(() => {
  return Number(form.baseRent) + Number(form.electricity) + Number(form.utility);
});

const totalInvoiced = computed(() => {
  return invoices.value.reduce((sum, inv) => sum + Number(inv.total), 0);
});

const totalCollected = computed(() => {
  return invoices.value
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + Number(inv.total), 0);
});

const totalPending = computed(() => {
  return invoices.value
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + Number(inv.total), 0);
});

// --- LOCAL STORAGE LOGIC ---
const LOCAL_STORAGE_KEY = "house_rent_invoices";

onMounted(() => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedData) {
    invoices.value = JSON.parse(savedData);
  } else {
    // Adjusted dummy data to include the breakdown for the print layout
    invoices.value = [
      {
        id: "INV-1001",
        tenant: "Emran (A-101)",
        month: "2026-04",
        baseRent: 12000,
        electricity: 1500,
        utility: 1000,
        total: 14500,
        status: "Paid",
      },
      {
        id: "INV-1002",
        tenant: "Arif (B-205)",
        month: "2026-04",
        baseRent: 12000,
        electricity: 200,
        utility: 1000,
        total: 13200,
        status: "Pending",
      },
    ];
  }
});

watch(invoices, (newVal) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal));
  },
  { deep: true }
);

// --- Methods ---

const openAddDialog = () => {
  form.tenant = null;
  const today = new Date();
  form.month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  form.baseRent = 12000;
  form.electricity = 0;
  form.utility = 1000;
  showDialog.value = true;
};

const saveInvoice = () => {
  loading.value = true;

  setTimeout(() => {
    const newId = `INV-${1000 + invoices.value.length + 1}`;

    // Note: We now save the individual breakdown amounts so the print layout has data
    invoices.value.unshift({
      id: newId,
      tenant: form.tenant,
      month: form.month,
      baseRent: Number(form.baseRent),
      electricity: Number(form.electricity),
      utility: Number(form.utility),
      total: calculatedTotal.value,
      status: "Pending",
    });

    $q.notify({ type: "positive", message: "Invoice generated successfully!", position: "top" });

    loading.value = false;
    showDialog.value = false;
  }, 600);
};

const markAsPaid = (row) => {
  $q.dialog({
    title: "Confirm Payment",
    message: `Mark invoice ${row.id} for ${row.tenant} as Paid?`,
    cancel: true,
    persistent: true,
    ok: { color: "positive", label: "Confirm" },
  }).onOk(() => {
    row.status = "Paid";
    $q.notify({ type: "positive", message: "Invoice marked as Paid.", position: "top" });
  });
};

const confirmDelete = (row) => {
  $q.dialog({
    title: "Delete Invoice",
    message: `Are you sure you want to delete invoice ${row.id}?`,
    cancel: true,
    persistent: true,
    ok: { color: "negative", label: "Delete" },
    cancel: { flat: true, color: "grey-8" },
  }).onOk(() => {
    invoices.value = invoices.value.filter((inv) => inv.id !== row.id);
    $q.notify({ type: "warning", message: "Invoice deleted.", icon: "delete", position: "top" });
  });
};

// --- PRINT PREVIEW LOGIC ---
const openPrintPreview = (row) => {
  activeInvoice.value = row;
  showPrintDialog.value = true;
};

const executePrint = () => {
  window.print();
};
</script>

<style scoped>
/* MAGIC CSS FOR PRINTING */
@media print {
  /* 1. Hide everything on the original page */
  body * {
    visibility: hidden;
  }
  
  /* 2. Hide Quasar's dialog backdrop and the top action bar */
  .q-dialog__backdrop, .no-print {
    display: none !important;
  }

  /* 3. Make ONLY the invoice visible and position it perfectly */
  #printable-invoice, #printable-invoice * {
    visibility: visible;
  }
  
  #printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0 !important;
    box-shadow: none !important;
  }
}
</style>