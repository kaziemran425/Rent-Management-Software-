<template>
  <q-page padding class="bg-grey-1 flex justify-center">
    <div class="full-width" style="max-width: 800px;">

      <div class="row items-center q-mb-xl q-mt-md q-px-sm">
        <q-avatar size="48px" color="blue-1" text-color="primary" class="q-mr-md">
          <q-icon name="campaign" />
        </q-avatar>
        <div>
          <h4 class="text-h5 text-weight-medium text-dark q-my-none" style="color: #202124;">Notice Board</h4>
          <div class="text-subtitle2" style="color: #5f6368;">Important announcements from management</div>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner-google color="primary" size="3em" />
      </div>

      <div v-else-if="notices.length === 0" class="text-center q-pa-xl google-card bg-white q-mt-md">
        <q-icon name="notifications_paused" size="80px" color="grey-4" />
        <div class="text-h6 text-weight-medium q-mt-md" style="color: #202124;">No new notices</div>
        <div style="color: #5f6368;">You're all caught up! There are no announcements at this time.</div>
      </div>

      <div v-else class="column q-gutter-y-md">
        <q-card
          v-for="notice in notices"
          :key="notice.id"
          flat
          class="google-card bg-white"
        >
          <q-card-section class="q-pa-md">
            <div class="row no-wrap items-start">

              <q-avatar
                size="40px"
                :color="notice.urgent ? 'red-1' : 'grey-2'"
                :text-color="notice.urgent ? 'negative' : 'grey-8'"
                class="q-mr-md q-mt-xs"
              >
                <q-icon :name="notice.urgent ? 'warning' : 'notifications'" size="20px" />
              </q-avatar>

              <div class="col">
                <div class="row justify-between items-center q-mb-xs">
                  <div class="text-subtitle1 text-weight-medium line-height-tight" style="color: #202124;">
                    {{ notice.title }}
                  </div>
                  <div class="text-caption" style="color: #5f6368;">
                    {{ notice.date }}
                  </div>
                </div>

                <div v-if="notice.urgent" class="q-mb-sm">
                  <q-badge color="negative" outline class="text-weight-bold" style="border-radius: 4px;">
                    URGENT
                  </q-badge>
                </div>

                <div class="text-body2" style="color: #3c4043; line-height: 1.5;">
                  {{ notice.content }}
                </div>
              </div>

            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- State ---
const isLoading = ref(true)
const notices = ref([])

// Shared Local Storage key with the Admin panel
const LOCAL_STORAGE_KEY = 'house_rent_notices'

// --- Lifecycle ---
onMounted(() => {
  fetchNotices()
})

// --- API Integration Readiness ---
const fetchNotices = () => {
  isLoading.value = true

  // INTEGRATION POINT: Replace setTimeout with axios.get('/api/tenant/notices')
  setTimeout(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (savedData) {
      notices.value = JSON.parse(savedData)
    } else {
      // Default Fallback Data if LocalStorage is empty
      notices.value = [
        {
          id: 1,
          date: 'April 14, 2026',
          title: 'Water Supply Interruption',
          content: 'Please be advised that the water supply will be interrupted on April 16th between 10 AM and 2 PM for scheduled maintenance. We apologize for any inconvenience this may cause.',
          urgent: true
        },
        {
          id: 2,
          date: 'April 01, 2026',
          title: 'Welcome to the New Tenant Portal',
          content: 'We are excited to launch our new portal. You can now pay rent, submit complaints, and message us directly through this system.',
          urgent: false
        }
      ]
      // Save defaults to LocalStorage so the admin panel can see them too
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notices.value))
    }

    // Sort notices to show newest/urgent ones first (optional logic)
    notices.value.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return new Date(b.date) - new Date(a.date);
    })

    isLoading.value = false
  }, 600) // Fake network delay for smooth UI transition
}
</script>

<style scoped>
/* Google Material 3 / Workspace Card Style */
.google-card {
  border-radius: 12px;
  border: 1px solid #dadce0; /* Google's standard subtle border color */
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

/* Optional hover effect */
.google-card:hover {
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
}

.line-height-tight {
  line-height: 1.3;
}
</style> 
