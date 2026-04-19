<template>
  <q-badge
    :color="badgeData.bg"
    :text-color="badgeData.text"
    class="status-badge text-weight-bolder"
    rounded
  >
    <q-icon :name="badgeData.icon" size="14px" class="q-mr-xs" v-if="badgeData.icon" />
    <span class="letter-spacing-tight">{{ badgeData.label }}</span>
  </q-badge>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    default: 'unknown'
  }
})

// --- Smart SaaS Dictionary ---
// Modern design uses soft backgrounds (bg) with strong text colors (text)
const statusMap = {
  // Payment Statuses
  paid: { bg: 'green-1', text: 'green-9', icon: 'check_circle', label: 'Paid' },
  pending: { bg: 'orange-1', text: 'orange-9', icon: 'schedule', label: 'Pending' },
  overdue: { bg: 'red-1', text: 'red-9', icon: 'error_outline', label: 'Overdue' },

  // Agreement / Tenant Statuses
  active: { bg: 'green-1', text: 'green-9', icon: 'verified', label: 'Active' },
  reviewing: { bg: 'blue-1', text: 'primary', icon: 'visibility', label: 'Under Review' },
  rejected: { bg: 'red-1', text: 'red-9', icon: 'cancel', label: 'Rejected' },
  left: { bg: 'grey-2', text: 'grey-8', icon: 'directions_run', label: 'Moved Out' },

  // Maintenance/Complaint Statuses
  open: { bg: 'red-1', text: 'red-9', icon: 'report_problem', label: 'Action Required' },
  in_progress: { bg: 'blue-1', text: 'primary', icon: 'engineering', label: 'In Progress' },
  resolved: { bg: 'green-1', text: 'green-9', icon: 'task_alt', label: 'Resolved' },

  // Fallback
  default: { bg: 'grey-2', text: 'grey-8', icon: 'help_outline', label: 'Unknown' }
}

// Safely normalize the incoming string to prevent Vue rendering errors
const badgeData = computed(() => {
  if (!props.status) return statusMap.default

  // Standardize the string: trim whitespace, make lowercase, replace spaces with underscores
  const normalizedStatus = props.status.trim().toLowerCase().replace(/\s+/g, '_')

  return statusMap[normalizedStatus] || statusMap.default
})
</script>

<style scoped>
.status-badge {
  /* Slightly more padding for a premium pill shape */
  padding: 6px 12px;
  font-size: 11px;
  text-transform: uppercase;
  /* Add a very subtle border matching the text color but highly transparent */
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.letter-spacing-tight {
  letter-spacing: 0.5px;
}
</style>
