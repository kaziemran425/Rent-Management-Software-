<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-dark">
      <q-toolbar class="q-py-sm">
        <q-btn flat round color="primary" icon="home_work" size="lg" to="/Home" />
        
        <q-toolbar-title class="text-weight-bold text-primary">
          TenantPortal
        </q-toolbar-title>

        <q-tabs align="left" class="gt-sm text-grey-8" active-color="primary" indicator-color="primary">
          <q-route-tab to="/Home" label="Dashboard" />
          <q-route-tab to="/RentRecord" label="My Payments" />
          <q-route-tab to="/Agreement" label="Agreement" />
          <q-route-tab to="/Complaint" label="Support" />
        </q-tabs>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn outline color="primary" label="Login" to="/Login" v-if="!isLoggedIn" />
          
          <template v-else>
            <q-btn flat round icon="o_notifications" />
            <q-btn flat round to="/Profile">
              <q-avatar size="32px">
                <img src="https://cdn.quasar.dev/img/avatar2.png">
              </q-avatar>
            </q-btn>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-blue-grey-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

// This would usually come from your authStore
const isLoggedIn = ref(true) 
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>