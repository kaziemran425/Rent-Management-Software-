<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Tenant Portal</q-toolbar-title>
        <q-btn flat round icon="person" to="/tenant/profile" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>My Apartment</q-item-label>

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

    <q-page-container class="bg-grey-1">
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
  { title: 'Dashboard', icon: 'dashboard', route: '/tenant/dashboard' },
  { title: 'Rent Records', icon: 'payment', route: '/tenant/rent-records' },
  { title: 'My Agreement', icon: 'assignment', route: '/tenant/agreement' },
  { title: 'Notice Board', icon: 'notifications', route: '/tenant/notices' },
  { title: 'Complaints', icon: 'report_problem', route: '/tenant/complaints' },
  { title: 'Messages', icon: 'message', route: '/tenant/messages' },
]
</script>
