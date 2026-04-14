<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Rent Manager Admin </q-toolbar-title>

        <q-btn-dropdown
          flat
          no-caps
          stretch
          icon="account_circle"
          label="Owner Panel"
        >
          <q-list>
            <q-item clickable v-close-popup to="/profile">
              <q-item-section>Profile</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section class="text-negative">Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header>Management Menu</q-item-label>

        <q-item clickable v-ripple to="/admin/Dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/flats">
          <q-item-section avatar><q-icon name="apartment" /></q-item-section>
          <q-item-section>Flats</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/tenants">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Tenants</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/buildings">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Buildings</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/Account">
          <q-item-section avatar><q-icon name="business" /></q-item-section>
          <q-item-section>Account</q-item-section>
        </q-item>

        <q-separator q-my-md />

        <q-item clickable v-ripple to="/admin/invoices">
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section>Invoices & Billing</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/notices">
          <q-item-section avatar><q-icon name="campaign" /></q-item-section>
          <q-item-section>Notices</q-item-section>
        </q-item>
      
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const leftDrawerOpen = ref(false);
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  // Add logout logic here (clear storage etc.)
  router.push("/login");
}
</script>
