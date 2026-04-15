<template>
  <q-badge
    :color="badgeData.color"
    :text-color="badgeData.textColor || 'white'"
    class="q-pa-xs q-px-sm text-weight-bold"
    rounded
  >
    <q-icon :name="badgeData.icon" size="14px" class="q-mr-xs" v-if="badgeData.icon" />
    {{ badgeData.label }}
  </q-badge>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

// Dictionary of statuses mapped to Quasar colors and icons
const statusMap = {
  // Payment Statuses
  paid: { color: 'positive', icon: 'check_circle', label: 'Paid' },
  pending: { color: 'warning', icon: 'schedule', label: 'Pending', textColor: 'black' },
  overdue: { color: 'negative', icon: 'error_outline', label: 'Overdue' },

  // Agreement Statuses
  active: { color: 'positive', icon: 'verified', label: 'Active' },
  reviewing: { color: 'info', icon: 'visibility', label: 'Under Review' },
  rejected: { color: 'negative', icon: 'cancel', label: 'Rejected' },

  // Maintenance/Complaint Statuses
  open: { color: 'negative', icon: 'report_problem', label: 'Open' },
  in_progress: { color: 'primary', icon: 'engineering', label: 'In Progress' },
  resolved: { color: 'positive', icon: 'task_alt', label: 'Resolved' },

  // Fallback
  default: { color: 'grey', icon: 'help_outline', label: 'Unknown' }
}

const badgeData = computed(() => {
  const normalizedStatus = props.status.toLowerCase()
  return statusMap[normalizedStatus] || statusMap.default
})
</script>
