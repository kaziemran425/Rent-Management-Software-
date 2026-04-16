<template>
  <q-card class="chat-window column no-wrap" flat bordered>
    <q-card-section class="bg-white text-dark row items-center q-pa-sm header-border">
      <q-avatar size="42px" class="q-mr-md relative-position">
        <img :src="chatPartnerAvatar" :alt="chatPartnerName">
        <q-badge floating rounded color="positive" class="online-dot" v-if="isPartnerOnline" />
      </q-avatar>

      <div class="col">
        <div class="text-subtitle1 text-weight-bold line-height-tight">{{ chatPartnerName }}</div>
        <div class="text-caption text-grey-6 line-height-tight" v-if="isPartnerOnline">Active now</div>
        <div class="text-caption text-grey-6 line-height-tight" v-else>Offline</div>
      </div>

      <q-space />

      <div class="q-gutter-xs">
        <q-btn flat round dense color="primary" icon="call" />
        <q-btn flat round dense color="primary" icon="videocam" />
        <q-btn flat round dense color="grey-7" icon="info" />
      </div>
    </q-card-section>

    <q-scroll-area ref="chatScrollArea" class="col bg-white q-pa-md scroll-area-custom">
      <div v-if="isLoadingHistory" class="text-center q-my-md">
        <q-spinner color="primary" size="2em" />
      </div>

      <div v-else-if="messages.length === 0" class="text-center q-mt-xl column items-center">
        <q-avatar size="80px" class="q-mb-md">
          <img :src="chatPartnerAvatar">
        </q-avatar>
        <div class="text-h6 text-weight-bold">{{ chatPartnerName }}</div>
        <div class="text-grey-6">You are connected on Iching App</div>
      </div>

      <div v-for="(msg) in messages" :key="msg.id || msg.time + msg.text">
        <q-chat-message
          :name="msg.isMine ? '' : chatPartnerName"
          :avatar="msg.isMine ? '' : chatPartnerAvatar"
          :text="[msg.text]"
          :stamp="msg.time"
          :sent="msg.isMine"
          :bg-color="msg.isMine ? 'primary' : 'grey-2'"
          :text-color="msg.isMine ? 'white' : 'dark'"
          class="q-mb-sm message-bubble"
        />
      </div>

      <q-chat-message
        v-if="isTyping"
        :name="chatPartnerName"
        :avatar="chatPartnerAvatar"
        bg-color="grey-2"
        class="q-mb-sm message-bubble"
      >
        <q-spinner-dots size="2rem" color="grey-7" />
      </q-chat-message>
    </q-scroll-area>

    <q-card-actions class="bg-white q-pa-sm row items-end input-area-border">
      <q-btn round dense flat icon="add_circle" color="primary" class="q-mr-sm q-mb-xs" />
      <q-btn round dense flat icon="photo_camera" color="primary" class="q-mr-sm q-mb-xs" />

      <q-input
        v-model="newMessage"
        class="col bg-grey-2 input-pill"
        dense
        borderless
        placeholder="Aa"
        autogrow
        @keyup.enter.prevent="sendMessage"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="sentiment_satisfied" color="primary" />
        </template>
      </q-input>

      <q-btn
        round
        dense
        flat
        :icon="newMessage.trim() ? 'send' : 'thumb_up'"
        color="primary"
        class="q-ml-sm q-mb-xs"
        @click="sendMessage"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'

const props = defineProps({
  chatId: {
    type: [String, Number],
    required: true,
    description: 'Unique ID for the chat room, used for local storage'
  },
  chatPartnerName: {
    type: String,
    default: 'Support'
  },
  chatPartnerAvatar: {
    type: String,
    default: 'https://cdn.quasar.dev/img/avatar5.jpg'
  },
  messages: {
    type: Array,
    default: () => [] // Expected: { id: 1, text: 'Hi', time: '10:00 AM', isMine: true }
  },
  // New props for API readiness
  isLoadingHistory: {
    type: Boolean,
    default: false
  },
  isTyping: {
    type: Boolean,
    default: false
  },
  isPartnerOnline: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['send-message'])

const newMessage = ref('')
const chatScrollArea = ref(null)

// --- LOCAL STORAGE LOGIC (Drafting) ---
// Save unsent text if the user accidentally closes the tab or navigates away
const draftStorageKey = computed(() => `chat_draft_${props.chatId}`)

onMounted(() => {
  const savedDraft = localStorage.getItem(draftStorageKey.value)
  if (savedDraft) {
    newMessage.value = savedDraft
  }
  scrollToBottom()
})

watch(newMessage, (val) => {
  if (val.trim() === '') {
    localStorage.removeItem(draftStorageKey.value)
  } else {
    localStorage.setItem(draftStorageKey.value, val)
  }
})
// --------------------------------------

const sendMessage = () => {
  if (newMessage.value.trim() === '') {
    // If empty and they click the button, send a "Like" (Messenger behavior)
    emit('send-message', '👍')
    return
  }

  // Emit the text to the parent view
  emit('send-message', newMessage.value)

  // Clear input & local storage draft
  newMessage.value = ''
  localStorage.removeItem(draftStorageKey.value)
}

// Auto-scroll logic
const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollArea.value) {
    chatScrollArea.value.setScrollPercentage('vertical', 1.0, 100)
  }
}

// Watchers for scrolling when new messages arrive or typing starts
watch(() => props.messages, scrollToBottom, { deep: true })
watch(() => props.isTyping, (typing) => {
  if (typing) scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-window {
  height: 100%;
  min-height: 500px;
  max-height: calc(100vh - 120px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.header-border {
  border-bottom: 1px solid #e0e0e0;
  z-index: 2;
}

.input-area-border {
  border-top: 1px solid #e0e0e0;
}

.online-dot {
  bottom: 0;
  right: -2px;
  border: 2px solid white;
  width: 12px;
  height: 12px;
}

.line-height-tight {
  line-height: 1.2;
}

/* Messenger-style Message Bubbles */
:deep(.message-bubble .q-message-text) {
  border-radius: 18px !important;
  padding: 8px 14px;
  font-size: 15px;
}

/* Hide current user's avatar to match Messenger */
:deep(.q-message-sent .q-message-avatar) {
  display: none;
}
:deep(.q-message-sent .q-message-container) {
  align-items: flex-end;
}

/* Pill-shaped Input */
.input-pill {
  border-radius: 20px;
  padding-left: 12px;
  padding-right: 4px;
  overflow: hidden;
}

/* Custom Scrollbar to look cleaner */
.scroll-area-custom :deep(.q-scrollarea__thumb) {
  background: rgba(0,0,0,0.15);
  border-radius: 4px;
}
</style>
