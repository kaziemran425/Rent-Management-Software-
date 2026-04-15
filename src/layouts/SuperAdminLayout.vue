<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>SaaS Super Admin</q-toolbar-title>
        <q-btn flat label="Logout" icon="logout" to="/" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-3">
      <q-list>
        <q-item-label header>System Overview</q-item-label>

        <q-item v-for="link in menuLinks" :key="link.title" clickable tag="a" :to="link.route" exact>
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const menuLinks = [
  { title: 'Dashboard', icon: 'speed', route: '/super-admin/dashboard' },
  // Ensure you add these paths to your router.js when you build the pages
  { title: 'Landlords', icon: 'business', route: '/super-admin/landlords' },
  { title: 'Subscriptions', icon: 'card_membership', route: '/super-admin/subscriptions' },
]
</script>
