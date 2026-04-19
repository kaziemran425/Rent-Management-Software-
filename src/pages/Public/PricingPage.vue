<template>
  <q-page padding class="flex flex-center bg-grey-1 relative-position">
    <div class="bg-decor top-left"></div>
    <div class="bg-decor bottom-right"></div>

    <div class="full-width z-top" style="max-width: 1100px;">

      <div class="text-center q-mb-xl q-mt-lg">
        <q-chip color="blue-1" text-color="primary" class="text-weight-bold q-mb-md" size="sm">PRICING PLANS</q-chip>
        <h2 class="text-h3 text-weight-bolder q-my-none tracking-tight text-dark">Simple, Transparent Pricing</h2>
        <p class="text-h6 text-grey-7 q-mt-sm text-weight-regular">Choose the perfect plan for your property management needs.</p>

        <div class="row justify-center items-center q-mt-xl bg-white q-pa-sm inline-block shadow-1 rounded-borders" style="border-radius: 50px;">
          <span :class="yearly ? 'text-grey-6' : 'text-dark text-weight-bold'" class="q-px-md transition-color">Monthly</span>
          <q-toggle v-model="yearly" color="primary" size="lg" />
          <span :class="yearly ? 'text-dark text-weight-bold' : 'text-grey-6'" class="q-px-md transition-color row items-center">
            Yearly
            <q-badge color="positive" class="q-ml-sm text-weight-bold shadow-1" style="border-radius: 6px; padding: 4px 8px;">Save 20%</q-badge>
          </span>
        </div>
      </div>

      <div class="row q-col-gutter-lg justify-center items-center q-pb-xl">

        <div class="col-12 col-md-4">
          <q-card bordered flat class="pricing-card bg-white column fit">
            <q-card-section class="text-center q-pa-xl col-grow">
              <div class="text-subtitle1 text-uppercase text-grey-6 text-weight-bold q-mb-sm">Starter</div>
              <div class="text-h2 text-weight-bolder text-dark">
                ${{ yearly ? '24' : '29' }}
                <span class="text-subtitle1 text-grey-6 text-weight-medium">/mo</span>
              </div>
              <div class="text-body2 text-grey-6 q-mt-sm">Perfect for up to 10 units</div>

              <q-list dense class="text-grey-8 text-left q-mt-xl q-gutter-y-sm">
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Basic Rent Tracking</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Tenant Portal</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Standard Support</q-item-section></q-item>
              </q-list>
            </q-card-section>

            <q-card-actions class="q-pa-lg">
              <q-btn
                outline
                color="primary"
                class="full-width text-weight-bold"
                size="lg"
                label="Start Free Trial"
                :loading="processingPlan === 'Starter'"
                @click="selectPlan('Starter', yearly ? 24 : 29)"
              />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-4 relative-position">
          <div class="absolute-top text-center z-max" style="top: -15px; left: 0; right: 0;">
            <q-badge color="warning" text-color="dark" class="text-weight-bold shadow-3 text-uppercase" style="padding: 6px 16px; border-radius: 20px; font-size: 12px;">
              Most Popular
            </q-badge>
          </div>

          <q-card bordered class="pricing-card highlighted-card bg-primary text-white shadow-10 column fit">
            <q-card-section class="text-center q-pa-xl col-grow">
              <div class="text-subtitle1 text-uppercase text-blue-2 text-weight-bold q-mb-sm">Professional</div>
              <div class="text-h2 text-weight-bolder text-white">
                ${{ yearly ? '79' : '99' }}
                <span class="text-subtitle1 text-blue-2 text-weight-medium">/mo</span>
              </div>
              <div class="text-body2 text-blue-2 q-mt-sm">Manage up to 50 units</div>

              <q-list dense class="text-left q-mt-xl q-gutter-y-sm">
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="white" size="sm" /></q-item-section><q-item-section>Everything in Starter</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="white" size="sm" /></q-item-section><q-item-section class="text-weight-bold">Online Rent Collection</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="white" size="sm" /></q-item-section><q-item-section>Maintenance Tracking</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="white" size="sm" /></q-item-section><q-item-section>Digital Agreements</q-item-section></q-item>
              </q-list>
            </q-card-section>

            <q-card-actions class="q-pa-lg">
              <q-btn
                color="white"
                text-color="primary"
                class="full-width text-weight-bolder shadow-3"
                size="lg"
                label="Get Started"
                :loading="processingPlan === 'Professional'"
                @click="selectPlan('Professional', yearly ? 79 : 99)"
              />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card bordered flat class="pricing-card bg-white column fit">
            <q-card-section class="text-center q-pa-xl col-grow">
              <div class="text-subtitle1 text-uppercase text-grey-6 text-weight-bold q-mb-sm">Enterprise</div>
              <div class="text-h2 text-weight-bolder text-dark">Custom</div>
              <div class="text-body2 text-grey-6 q-mt-sm">Unlimited units & scale</div>

              <q-list dense class="text-grey-8 text-left q-mt-xl q-gutter-y-sm">
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Everything in Pro</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Custom API Integrations</q-item-section></q-item>
                <q-item class="q-px-none"><q-item-section avatar min-width="30px"><q-icon name="check_circle" color="positive" size="sm" /></q-item-section><q-item-section>Dedicated Account Manager</q-item-section></q-item>
              </q-list>
            </q-card-section>

            <q-card-actions class="q-pa-lg">
              <q-btn
                outline
                color="dark"
                class="full-width text-weight-bold"
                size="lg"
                label="Contact Sales"
                href="mailto:sales@iching.com"
              />
            </q-card-actions>
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- State ---
const yearly = ref(true)
const processingPlan = ref(null)

const BILLING_PREF_KEY = 'house_rent_billing_preference'
const SELECTED_PLAN_KEY = 'house_rent_selected_plan'

// --- Lifecycle ---
onMounted(() => {
  // Remember the user's toggle preference if they return to this page
  const savedPref = localStorage.getItem(BILLING_PREF_KEY)
  if (savedPref !== null) {
    yearly.value = JSON.parse(savedPref)
  }
})

// Auto-save the toggle preference
watch(yearly, (newVal) => {
  localStorage.setItem(BILLING_PREF_KEY, JSON.stringify(newVal))
})

// --- Methods ---
const selectPlan = (planName, price) => {
  processingPlan.value = planName

  // INTEGRATION POINT: Save the exact cart/plan data to LocalStorage
  // so the /auth/register or checkout page knows what to charge them.
  const planData = {
    name: planName,
    price: price,
    billingCycle: yearly.value ? 'yearly' : 'monthly',
    currency: 'USD'
  }

  localStorage.setItem(SELECTED_PLAN_KEY, JSON.stringify(planData))

  // Simulate a brief loading state for UX, then redirect
  setTimeout(() => {
    processingPlan.value = null
    router.push('/auth/register')
  }, 400)
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.03em;
}

.transition-color {
  transition: color 0.3s ease;
}

.pricing-card {
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-color: #e0e0e0;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}

/* On medium screens and up, make the middle card slightly taller */
@media (min-width: 1024px) {
  .highlighted-card {
    transform: scale(1.05);
    z-index: 1;
  }
  .highlighted-card:hover {
    transform: scale(1.05) translateY(-8px);
  }
}

/* Subtle background decorations for a premium SaaS feel */
.bg-decor {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.4;
}

.top-left {
  top: -10%;
  left: -5%;
  width: 400px;
  height: 400px;
  background: var(--q-primary);
  opacity: 0.15;
}

.bottom-right {
  bottom: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: var(--q-info);
  opacity: 0.1;
}
</style>
