<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/quasar-logo-vertical.svg" />
          </q-avatar>
          Rent Management SaaS
        </q-toolbar-title>

        <q-btn flat label="Home" to="/" />
        <q-btn flat label="Pricing" to="/pricing" />
        <q-space />
        <q-btn flat label="Login" to="/auth/login" />
        <q-btn outline label="Register" to="/auth/register" class="q-ml-sm" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// No complex logic needed for the public layout
</script>
