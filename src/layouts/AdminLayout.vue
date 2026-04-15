<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Landlord Portal</q-toolbar-title>
        <q-btn flat round icon="account_circle" to="/admin/account" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Management Menu</q-item-label>

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

    <q-page-container class="bg-grey-2">
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
  { title: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
  { title: 'Buildings', icon: 'domain', route: '/admin/buildings' },
  { title: 'Flats', icon: 'meeting_room', route: '/admin/flats' },
  { title: 'Tenants', icon: 'people', route: '/admin/tenants' },
  { title: 'Agreements', icon: 'description', route: '/admin/agreements' },
  { title: 'Invoices', icon: 'receipt', route: '/admin/invoices' },
  { title: 'Reports', icon: 'bar_chart', route: '/admin/reports' },
  { title: 'Notices', icon: 'campaign', route: '/admin/notices' },
  { title: 'Maintenance', icon: 'build', route: '/admin/maintenance' },
  { title: 'Messages', icon: 'chat', route: '/admin/messages' },
  { title: 'Settings', icon: 'settings', route: '/admin/settings' },
]
</script>
