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
            <q-item clickable v-close-popup to="/Profile">
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

        <q-item clickable v-ripple to="/Home">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/Agreement">
          <q-item-section avatar><q-icon name="apartment" /></q-item-section>
          <q-item-section>Lease Agreements</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/RentRecord">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Rent Records</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/Complaint">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Maintenance & Support</q-item-section>
        </q-item>

        <q-separator q-my-md />

        <q-item clickable v-ripple to="/Login">
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section>Login</q-item-section>
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
