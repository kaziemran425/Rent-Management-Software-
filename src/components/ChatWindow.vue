<template>
  <q-card class="chat-window column no-wrap bg-white" flat bordered>

    <q-card-section class="bg-white text-dark row items-center q-pa-sm header-glass z-top">
      <q-btn flat round dense icon="arrow_back" color="grey-8" class="q-mr-sm lt-md" v-close-popup />

      <q-avatar size="42px" class="q-mr-md relative-position cursor-pointer">
        <img :src="chatPartnerAvatar" :alt="chatPartnerName">
        <q-badge
          floating
          rounded
          :color="isPartnerOnline ? 'positive' : 'grey-5'"
          class="online-dot"
        />
      </q-avatar>

      <div class="col cursor-pointer">
        <div class="text-subtitle1 text-weight-bold line-height-tight text-dark">{{ chatPartnerName }}</div>
        <div class="text-caption text-weight-medium line-height-tight" :class="isPartnerOnline ? 'text-positive' : 'text-grey-6'">
          {{ isPartnerOnline ? 'Active now' : 'Offline' }}
        </div>
      </div>

      <q-space />

      <div class="q-gutter-xs">
        <q-btn flat round dense color="primary" icon="call">
          <q-tooltip>Voice Call</q-tooltip>
        </q-btn>
        <q-btn flat round dense color="primary" icon="videocam">
          <q-tooltip>Video Call</q-tooltip>
        </q-btn>
        <q-btn flat round dense color="grey-7" icon="more_vert" />
      </div>
    </q-card-section>

    <q-scroll-area
      ref="chatScrollArea"
      class="col bg-grey-1 q-pa-md scroll-area-custom chat-background"
    >
      <div v-if="isLoadingHistory" class="text-center q-my-xl">
        <q-spinner color="primary" size="2.5em" />
        <div class="text-grey-6 q-mt-sm">Loading messages...</div>
      </div>

      <div v-else-if="messages.length === 0" class="text-center q-mt-xl column items-center">
        <q-avatar size="90px" class="q-mb-md shadow-2">
          <img :src="chatPartnerAvatar">
        </q-avatar>
        <div class="text-h6 text-weight-bold text-dark">{{ chatPartnerName }}</div>
        <div class="text-body2 text-grey-6 q-mb-md">Property Management</div>
        <q-chip color="grey-3" text-color="grey-8" class="text-weight-medium">
          You are connected on Iching App
        </q-chip>
      </div>

      <div class="q-py-sm">
        <div v-for="(msg, index) in messages" :key="msg.id || index">
          <q-chat-message
            :name="msg.isMine ? '' : chatPartnerName"
            :avatar="msg.isMine ? '' : chatPartnerAvatar"
            :text="[msg.text]"
            :stamp="msg.time"
            :sent="msg.isMine"
            :bg-color="msg.isMine ? 'primary' : 'white'"
            :text-color="msg.isMine ? 'white' : 'dark'"
            class="q-mb-sm message-bubble"
          />
        </div>

        <q-chat-message
          v-if="isTyping"
          :name="chatPartnerName"
          :avatar="chatPartnerAvatar"
          bg-color="white"
          text-color="dark"
          class="q-mb-sm message-bubble typing-bubble"
        >
          <q-spinner-dots size="2rem" color="grey-6" />
        </q-chat-message>
      </div>
    </q-scroll-area>

    <q-card-actions class="bg-white q-pa-sm row items-end input-area-border z-top">

      <div class="row items-center q-pb-xs">
        <q-btn round dense flat icon="add_circle" color="primary" class="q-mr-xs transition-btn" />
        <q-btn round dense flat icon="photo_camera" color="primary" class="q-mr-xs transition-btn" />
      </div>

      <q-input
        v-model="newMessage"
        class="col bg-grey-2 input-pill q-mx-xs"
        dense
        borderless
        placeholder="Message..."
        autogrow
        @keyup.enter.prevent="handleEnterKey"
      >
        <template v-slot:append>
          <q-btn round dense flat icon="sentiment_satisfied" color="primary" class="transition-btn" />
        </template>
      </q-input>

      <div class="row items-center q-pb-xs">
        <q-btn
          round
          dense
          flat
          :icon="newMessage.trim() ? 'send' : 'thumb_up'"
          color="primary"
          class="q-ml-xs transition-btn"
          @click="sendMessage"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'

const props = defineProps({
  chatId: {
    type: [String, Number],
    required: true,
    description: 'Unique ID for the chat room, used for local storage drafts'
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
    default: () => []
  },
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

// --- LOCAL STORAGE: Draft Management ---
const draftStorageKey = computed(() => `chat_draft_${props.chatId}`)

onMounted(() => {
  const savedDraft = localStorage.getItem(draftStorageKey.value)
  if (savedDraft) {
    newMessage.value = savedDraft
  }
  // Small delay to ensure DOM is painted before scrolling
  setTimeout(scrollToBottom, 100)
})

watch(newMessage, (val) => {
  if (val.trim() === '') {
    localStorage.removeItem(draftStorageKey.value)
  } else {
    localStorage.setItem(draftStorageKey.value, val)
  }
})

// --- METHODS ---
const handleEnterKey = (e) => {
  // Allow Shift+Enter for new lines, Enter to send
  if (!e.shiftKey) {
    sendMessage()
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() === '') {
    // If empty, emit a quick "Like" (Standard modern chat behavior)
    emit('send-message', '👍')
    scrollToBottom()
    return
  }

  // INTEGRATION POINT: Emit text to parent to handle API / WebSocket logic
  emit('send-message', newMessage.value.trim())

  // Clear input & local storage draft
  newMessage.value = ''
  localStorage.removeItem(draftStorageKey.value)

  scrollToBottom()
}

// --- Smooth Auto-Scroll Logic ---
const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollArea.value) {
    // Using Quasar's getScrollTarget and setScrollPosition for smoother animation
    const scrollTarget = chatScrollArea.value.getScrollTarget()
    const duration = 300 // ms
    chatScrollArea.value.setScrollPosition('vertical', scrollTarget.scrollHeight, duration)
  }
}

// Watchers to trigger scroll
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
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Glass effect for header */
.header-glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.input-area-border {
  border-top: 1px solid rgba(0,0,0,0.08);
  background: #ffffff;
}

/* Status Dot */
.online-dot {
  bottom: 0;
  right: -2px;
  border: 2px solid white;
  width: 14px;
  height: 14px;
}

.line-height-tight {
  line-height: 1.2;
}

/* Messenger-style Message Bubbles */
:deep(.message-bubble .q-message-text) {
  border-radius: 20px !important;
  padding: 10px 16px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Subtle lift */
}

/* Custom styling for received messages */
:deep(.q-message-received .q-message-text) {
  border-bottom-left-radius: 4px !important;
}

/* Custom styling for sent messages */
:deep(.q-message-sent .q-message-text) {
  border-bottom-right-radius: 4px !important;
}

/* Hide current user's avatar to match iMessage/Messenger */
:deep(.q-message-sent .q-message-avatar) {
  display: none;
}
:deep(.q-message-sent .q-message-container) {
  align-items: flex-end;
}

/* Pill-shaped Input */
.input-pill {
  border-radius: 24px;
  padding-left: 16px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  max-height: 120px; /* Prevents input from growing too tall */
  overflow-y: auto;
  transition: all 0.3s ease;
}

.input-pill:focus-within {
  background: #f0f2f5 !important;
}

/* Button Transitions */
.transition-btn {
  transition: transform 0.2s ease, color 0.2s ease;
}
.transition-btn:hover {
  transform: scale(1.1);
}

/* Custom Scrollbar for a cleaner UI */
.scroll-area-custom :deep(.q-scrollarea__thumb) {
  background: rgba(0,0,0,0.15);
  border-radius: 6px;
  width: 6px;
}

/* Optional: Very subtle background pattern for the chat area */
.chat-background {
  background-color: #f8f9fa;
  /* background-image: url('path-to-subtle-pattern.png'); */
}
</style>
