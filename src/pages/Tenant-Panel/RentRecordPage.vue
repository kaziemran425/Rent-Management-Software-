<template>
  <q-page padding class="bg-grey-1 flex justify-center">
    <div class="full-width" style="max-width: 1000px;">

      <div class="row items-center justify-between q-mb-lg q-mt-sm print-hide">
        <div>
          <h4 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight">Rent & Invoices</h4>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">Manage your billing, download receipts, and pay rent securely</div>
        </div>
        <q-btn
          color="primary"
          icon="refresh"
          label="Refresh"
          outline
          class="text-weight-bold bg-white"
          padding="8px 16px"
          @click="fetchInvoices"
        />
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl print-hide">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else class="print-hide">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-6">
            <q-card flat bordered class="shadow-1 rounded-borders bg-white fit">
              <q-card-section class="row items-center no-wrap">
                <div class="col">
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Total Balance Due</div>
                  <div class="text-h3 text-weight-bolder text-negative q-mt-sm">
                    ৳ {{ formatAmt(totalDue) }}
                  </div>
                </div>
                <q-avatar size="60px" color="red-1" text-color="negative" icon="account_balance_wallet" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered class="shadow-1 rounded-borders bg-white fit">
              <q-card-section class="row items-center no-wrap">
                <div class="col">
                  <div class="text-subtitle2 text-grey-7 text-uppercase text-weight-bold">Next Payment Deadline</div>
                  <div class="text-h4 text-weight-bolder text-dark q-mt-sm">
                    {{ nextDueDate || 'All Caught Up!' }}
                  </div>
                  <div v-if="nextDueDate" class="text-caption text-grey-6 q-mt-xs">Please pay before this date to avoid late fees.</div>
                </div>
                <q-avatar size="60px" color="blue-1" text-color="primary" icon="event" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card flat bordered class="shadow-1 rounded-borders bg-white">
          <q-table
            :rows="filteredInvoices"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
            table-header-class="bg-grey-2 text-dark text-weight-bold"
          >
            <template v-slot:top>
              <div class="text-h6 text-weight-bold text-dark col">Billing History</div>
              <q-space />
              <div class="row q-gutter-sm items-center">
                <q-select
                  v-model="statusFilter"
                  :options="['All', 'Pending', 'Paid', 'Overdue']"
                  outlined
                  dense
                  bg-color="white"
                  options-dense
                  style="min-width: 130px"
                />
              </div>
            </template>

            <template v-slot:body-cell-amount="props">
              <q-td :props="props" class="text-weight-bold text-dark">
                ৳ {{ formatAmt(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <StatusBadge :status="props.row.status" />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-sm">
                <q-btn size="sm" color="grey-7" icon="receipt_long" flat dense @click="openReceipt(props.row)">
                  <q-tooltip>View/Download Receipt</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status === 'pending' || props.row.status === 'overdue'"
                  size="sm"
                  color="primary"
                  label="Pay Now"
                  unelevated
                  class="text-weight-bold q-px-sm"
                  @click="openPaymentModal(props.row)"
                />
                <q-btn
                  v-else
                  size="sm"
                  color="positive"
                  icon="check"
                  flat
                  disable
                  label="Paid"
                  class="text-weight-bold"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="isReceiptModalOpen" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-3 column print-reset">

        <q-bar class="bg-dark text-white q-py-lg full-width print-hide shadow-2 z-top">
          <q-icon name="description" size="sm" />
          <div class="text-subtitle1 text-weight-bold q-ml-sm">Rent Receipt Preview</div>
          <q-space />
          <q-btn outline color="white" icon="print" label="Print / Save PDF" class="q-mr-md" @click="printReceipt" />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>

        <q-card-section class="col scroll flex flex-center q-pa-md print-full-width">
          <div class="classic-receipt bg-white shadow-3 q-pa-xl relative-position">

            <div
              class="receipt-stamp"
              :class="selectedReceipt?.status === 'paid' ? 'stamp-paid' : 'stamp-unpaid'"
            >
              {{ selectedReceipt?.status === 'paid' ? 'APPROVED' : 'UNPAID' }}
            </div>

            <h3 class="text-center text-weight-bold q-mt-none q-mb-lg" style="font-family: 'Times New Roman', serif;">Rent Receipt</h3>

            <div class="q-mb-md font-serif text-body1">
              <strong>Date:</strong> <span class="fill-blank" style="width: 200px;">{{ selectedReceipt?.dueDate }}</span>
              <span style="float: right;"><strong>No:</strong> <span class="fill-blank" style="width: 100px;">{{ selectedReceipt?.id }}</span></span>
            </div>

            <div class="row q-col-gutter-lg q-mb-lg font-serif dotted-bottom-section pb-md">
              <div class="col-6" style="border-right: 1px dashed #000;">
                <div class="text-center text-weight-bold q-mb-sm">Landlord</div>
                <div class="q-mb-xs"><strong>Name:</strong> <span class="fill-blank" style="width: 80%;">Iching Residences</span></div>
                <div><strong>Address:</strong> <span class="fill-blank" style="width: 75%;">Mirpur, Dhaka, Bangladesh</span></div>
              </div>
              <div class="col-6">
                <div class="text-center text-weight-bold q-mb-sm">Tenant</div>
                <div class="q-mb-xs"><strong>Name:</strong> <span class="fill-blank" style="width: 80%;">{{ tenantName }}</span></div>
                <div><strong>Address:</strong> <span class="fill-blank" style="width: 75%;">Flat A-101</span></div>
              </div>
            </div>

            <div class="font-serif text-body1 q-mb-lg line-height-loose">
              <div class="q-mb-sm"><strong>Received From:</strong> <span class="fill-blank" style="width: 75%;">{{ tenantName }}</span></div>
              <div class="q-mb-sm"><strong>The amount of:</strong> <span class="fill-blank" style="width: 77%;">{{ amountInWords(selectedReceipt?.amount) }} Taka Only</span></div>
              <div class="q-mb-sm"><strong>For Payment of:</strong> <span class="fill-blank" style="width: 76%;">Rent for the month of {{ selectedReceipt?.month }}</span></div>
            </div>

            <div class="row items-end q-mt-xl font-serif">
              <div class="col-6">
                <q-markup-table separator="cell" flat bordered dense class="calc-box">
                  <tbody>
                    <tr>
                      <td class="text-left">Total Amount to be Received</td>
                      <td class="text-right">৳ {{ formatAmt(selectedReceipt?.amount) }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Amount Received</td>
                      <td class="text-right">৳ {{ selectedReceipt?.status === 'paid' ? formatAmt(selectedReceipt?.amount) : '0.00' }}</td>
                    </tr>
                    <tr class="text-weight-bold bg-grey-2">
                      <td class="text-left">Balance Due</td>
                      <td class="text-right">৳ {{ selectedReceipt?.status === 'paid' ? '0.00' : formatAmt(selectedReceipt?.amount) }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>

              <div class="col-6 q-pl-xl">
                <div class="q-mb-md">
                  <q-icon v-if="selectedReceipt?.status === 'paid'" name="check_box" />
                  <q-icon v-else name="check_box_outline_blank" />
                  Cash
                  <q-icon name="check_box_outline_blank" class="q-ml-md" /> Cheque
                </div>
                <div><strong>Received By:</strong> <span class="fill-blank" style="width: 60%; display: inline-block;">Admin</span></div>
              </div>
            </div>

            <div class="q-mt-xl font-serif text-center">
              <strong>Description of Property</strong>
              <div class="fill-blank full-width q-mt-sm" style="height: 25px;">Residential Flat, Iching Management</div>
            </div>

          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isPaymentModalOpen" persistent>
      <q-card style="width: 450px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="bg-primary text-white row items-center q-py-md">
          <div class="text-h6 text-weight-bold">Secure Checkout</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg">
          <div class="text-center q-mb-lg">
            <div class="text-subtitle1 text-grey-7">Paying Invoice for</div>
            <div class="text-h5 text-weight-bold text-dark">{{ selectedInvoice?.month }}</div>
            <div class="text-h3 text-weight-bolder text-primary q-mt-sm">
              ৳ {{ formatAmt(selectedInvoice?.amount) }}
            </div>
          </div>

          <q-separator class="q-mb-md" />
          <div class="text-subtitle2 text-weight-bold q-mb-sm text-grey-8">Select Payment Method</div>

          <q-list bordered separator class="rounded-borders">
            <q-item tag="label" v-ripple>
              <q-item-section avatar><q-radio v-model="paymentMethod" val="card" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">Credit / Debit Card</q-item-label>
                <q-item-label caption>Instant processing</q-item-label>
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section avatar><q-radio v-model="paymentMethod" val="bank" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">Mobile Banking</q-item-label>
                <q-item-label caption>Takes a few hours to verify</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-slide-transition>
            <div v-show="paymentMethod === 'card'" class="q-mt-md">
              <q-input outlined dense placeholder="Card Number" mask="#### #### #### ####" class="q-mb-sm">
                <template v-slot:prepend><q-icon name="credit_card" color="grey-6" /></template>
              </q-input>
              <div class="row q-col-gutter-sm">
                <div class="col-6"><q-input outlined dense placeholder="MM/YY" mask="##/##" /></div>
                <div class="col-6"><q-input outlined dense placeholder="CVC" mask="###" /></div>
              </div>
            </div>
          </q-slide-transition>

          <div class="row justify-end q-mt-xl q-gutter-x-sm">
            <q-btn label="Cancel" color="grey-8" flat v-close-popup class="text-weight-bold" />
            <q-btn
              label="Confirm Payment"
              color="primary"
              unelevated
              class="text-weight-bold"
              :loading="isProcessingPayment"
              @click="processPayment"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import StatusBadge from 'src/components/StatusBadge.vue'

const $q = useQuasar()

const isLoading = ref(true)
const statusFilter = ref('All')

// Modal States
const isPaymentModalOpen = ref(false)
const isReceiptModalOpen = ref(false)
const isProcessingPayment = ref(false)

const selectedInvoice = ref(null)
const selectedReceipt = ref(null)
const paymentMethod = ref('card')
const tenantName = ref('Mitali') // Mocking current user

const LOCAL_STORAGE_KEY = 'tenant_invoice_records'

const columns = [
  { name: 'month', label: 'Billing Month', field: 'month', align: 'left', sortable: true },
  { name: 'dueDate', label: 'Due Date', field: 'dueDate', align: 'left', sortable: true },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const invoices = ref([])

onMounted(() => {
  fetchInvoices()
})

const fetchInvoices = () => {
  isLoading.value = true
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      invoices.value = JSON.parse(savedData)
    } else {
      invoices.value = [
        { id: 101, month: 'May 2026', amount: 15000, dueDate: '2026-05-01', status: 'pending' },
        { id: 102, month: 'April 2026', amount: 15000, dueDate: '2026-04-01', status: 'paid' },
        { id: 103, month: 'March 2026', amount: 15000, dueDate: '2026-03-01', status: 'paid' }
      ]
    }
    isLoading.value = false
  }, 600)
}

watch(invoices, (newVal) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const totalDue = computed(() => {
  return invoices.value
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)
})

const nextDueDate = computed(() => {
  const pendingInvoices = invoices.value.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
  if (pendingInvoices.length === 0) return null
  pendingInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  return new Date(pendingInvoices[0].dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})

const filteredInvoices = computed(() => {
  if (statusFilter.value === 'All') return invoices.value
  return invoices.value.filter(inv => inv.status.toLowerCase() === statusFilter.value.toLowerCase())
})

// --- Helper Functions ---
const formatAmt = (num) => num ? Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'

// Simple Number to Words Converter
const amountInWords = (num) => {
  if (!num) return ''
  const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num/10)] + ' ' + a[num%10];
  if (num < 1000) return a[Math.floor(num/100)] + 'Hundred ' + amountInWords(num%100);
  if (num < 100000) return amountInWords(Math.floor(num/1000)) + 'Thousand ' + amountInWords(num%1000);
  return num.toString();
}

// --- Methods ---
const openReceipt = (invoice) => {
  selectedReceipt.value = invoice
  isReceiptModalOpen.value = true
}

const printReceipt = () => {
  window.print()
}

const openPaymentModal = (invoice) => {
  selectedInvoice.value = invoice
  paymentMethod.value = 'card'
  isPaymentModalOpen.value = true
}

const processPayment = () => {
  isProcessingPayment.value = true
  setTimeout(() => {
    const index = invoices.value.findIndex(inv => inv.id === selectedInvoice.value.id)
    if (index !== -1) {
      invoices.value[index].status = 'paid'
    }
    $q.notify({ type: 'positive', message: 'Payment successful!', position: 'top-right' })
    isProcessingPayment.value = false
    isPaymentModalOpen.value = false
  }, 1500)
}
</script>

<style scoped>
.tracking-tight { letter-spacing: -0.02em; }
.rounded-borders { border-radius: 12px; }

/* Classic Receipt Design */
.classic-receipt {
  width: 100%;
  max-width: 800px;
  min-height: 500px;
  border: 2px solid #000;
  color: #000;
}
.font-serif {
  font-family: 'Times New Roman', Times, serif;
}
.fill-blank {
  display: inline-block;
  border-bottom: 1px solid #000;
  padding-left: 5px;
}
.line-height-loose {
  line-height: 1.8;
}
.dotted-bottom-section {
  border-bottom: 1px dashed #000;
  padding-bottom: 20px;
}

/* Updated .calc-box for q-markup-table */
.calc-box {
  width: 100%;
  border-color: #000 !important;
}
.calc-box td {
  border-color: #000 !important; /* Forces black border for the printable receipt look */
  padding: 8px 12px;
}

/* Watermark Rubber Stamp CSS */
.receipt-stamp {
  position: absolute;
  top: 15%;
  right: 15%;
  transform: rotate(-15deg);
  font-size: 70px;
  font-weight: 900;
  font-family: Arial, sans-serif;
  letter-spacing: 5px;
  border: 6px solid;
  border-radius: 10px;
  padding: 10px 20px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 10;
}
.stamp-paid {
  color: #e67e22;
  border-color: #e67e22;
}
.stamp-unpaid {
  color: #c10015;
  border-color: #c10015;
}

/* Print-Specific CSS */
@media print {
  body * { visibility: hidden; }
  .print-hide { display: none !important; }
  .classic-receipt, .classic-receipt * { visibility: visible; }
  .classic-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    box-shadow: none !important;
    margin: 0 !important;
  }
  .print-reset { background-color: white !important; }
  .print-full-width { padding: 0 !important; }
}
</style>
