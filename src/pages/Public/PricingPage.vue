<template>
  <q-page padding class="flex flex-center bg-grey-1">
    <div class="full-width" style="max-width: 1200px;">

      <div class="text-center q-mb-xl q-mt-lg">
        <h2 class="text-h3 text-weight-bolder q-mb-sm">Simple, Transparent Pricing</h2>
        <p class="text-subtitle1 text-grey-7">Choose the perfect plan for your property management needs.</p>

        <div class="row justify-center items-center q-mt-lg">
          <span :class="yearly ? 'text-grey' : 'text-dark text-weight-bold'">Monthly</span>
          <q-toggle v-model="yearly" color="primary" class="q-mx-sm" />
          <span :class="yearly ? 'text-dark text-weight-bold' : 'text-grey'">
            Yearly <q-badge color="positive" align="top" class="q-ml-xs">Save 20%</q-badge>
          </span>
        </div>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <div class="col-12 col-md-4">
          <q-card bordered flat class="pricing-card">
            <q-card-section class="text-center q-pa-lg">
              <div class="text-h6 text-uppercase text-grey-6 q-mb-sm">Starter</div>
              <div class="text-h3 text-weight-bold">${{ yearly ? '24' : '29' }}<span class="text-subtitle1 text-grey">/mo</span></div>
              <div class="text-caption text-grey-6 q-mt-sm">Up to 10 units</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="q-pa-lg">
              <q-list dense class="text-grey-8">
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Basic Rent Tracking</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Tenant Portal</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Standard Support</q-item-section></q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="q-pa-md">
              <q-btn outline color="primary" class="full-width" label="Start Free Trial" to="/auth/register" />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card bordered class="pricing-card bg-primary text-white shadow-10" style="transform: scale(1.05); z-index: 1;">
            <q-card-section class="text-center q-pa-lg">
              <div class="text-h6 text-uppercase text-blue-2 q-mb-sm">Professional</div>
              <div class="text-h3 text-weight-bold">${{ yearly ? '79' : '99' }}<span class="text-subtitle1 text-blue-2">/mo</span></div>
              <div class="text-caption text-blue-2 q-mt-sm">Up to 50 units</div>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section class="q-pa-lg">
              <q-list dense>
                <q-item><q-item-section avatar><q-icon name="check" color="white" /></q-item-section><q-item-section>Everything in Starter</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="white" /></q-item-section><q-item-section>Online Rent Collection</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="white" /></q-item-section><q-item-section>Maintenance Tracking</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="white" /></q-item-section><q-item-section>Digital Agreements</q-item-section></q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="q-pa-md">
              <q-btn color="white" text-color="primary" class="full-width text-weight-bold" label="Get Started" to="/auth/register" />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card bordered flat class="pricing-card">
            <q-card-section class="text-center q-pa-lg">
              <div class="text-h6 text-uppercase text-grey-6 q-mb-sm">Enterprise</div>
              <div class="text-h3 text-weight-bold">Custom</div>
              <div class="text-caption text-grey-6 q-mt-sm">Unlimited units</div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="q-pa-lg">
              <q-list dense class="text-grey-8">
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Everything in Pro</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Custom Integrations</q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="check" color="positive" /></q-item-section><q-item-section>Dedicated Account Manager</q-item-section></q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="q-pa-md">
              <q-btn outline color="dark" class="full-width" label="Contact Sales" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const yearly = ref(true)
</script>

<style scoped>
.pricing-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}
</style>
