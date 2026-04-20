<template>
  <q-page class="messenger-bg flex flex-center">
    <q-card class="messenger-window shadow-4 column no-wrap bg-white">

      <q-card-section class="header-glass row items-center q-pa-sm q-px-md z-top">
        <q-avatar size="40px" class="q-mr-sm relative-position cursor-pointer">
          <img src="https://cdn.quasar.dev/img/avatar3.jpg">
          <q-badge floating rounded color="positive" class="online-dot" />
        </q-avatar>

        <div class="col cursor-pointer">
          <div class="text-subtitle1 text-weight-bold line-height-tight text-dark">Property Manager</div>
          <div class="text-caption text-grey-6 line-height-tight">Active now</div>
        </div>

        <div class="q-gutter-xs text-primary">
          <q-btn flat round dense icon="call" @click="triggerCall('audio')" />
          <q-btn flat round dense icon="videocam" @click="triggerCall('video')" />
          <q-btn flat round dense icon="info" class="text-grey-7" />
        </div>
      </q-card-section>

      <q-scroll-area ref="chatScroll" class="col q-pa-md chat-area">
        <div class="text-center q-mb-lg q-mt-md column items-center">
          <q-avatar size="80px" class="q-mb-sm shadow-1">
            <img src="https://cdn.quasar.dev/img/avatar3.jpg">
          </q-avatar>
          <div class="text-h6 text-weight-bold text-dark">Property Manager</div>
          <div class="text-caption text-grey-6">Iching Residences Support</div>
        </div>

        <div v-for="msg in messages" :key="msg.id">
          <q-chat-message
            :name="msg.sender === 'tenant' ? '' : 'Manager'"
            :avatar="msg.sender === 'tenant' ? '' : 'https://cdn.quasar.dev/img/avatar3.jpg'"
            :text="[msg.text]"
            :sent="msg.sender === 'tenant'"
            :bg-color="msg.sender === 'tenant' ? 'primary' : 'grey-2'"
            :text-color="msg.sender === 'tenant' ? 'white' : 'dark'"
            class="messenger-bubble q-mb-sm"
          />
        </div>
      </q-scroll-area>

      <q-card-actions class="bg-white q-pa-sm row items-end z-top border-top">
        <div class="row items-center q-pb-xs text-primary">
          <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" />
          <q-btn round dense flat icon="add_circle" @click="triggerFileInput" />
          <q-btn round dense flat icon="photo_camera" @click="triggerFileInput" />
          <q-btn round dense flat icon="image" @click="triggerFileInput" />
          <q-btn round dense flat icon="mic" />
        </div>

        <q-input
          v-model="newMessage"
          class="col bg-grey-2 input-pill q-mx-sm"
          dense
          borderless
          placeholder="Type a message..."
          autogrow
          @keyup.enter.prevent="sendMessage"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="sentiment_satisfied" color="primary" />
          </template>
        </q-input>

        <div class="row items-center q-pb-xs">
          <q-btn
            round dense flat
            :icon="newMessage.trim() ? 'send' : 'thumb_up'"
            color="primary"
            @click="sendMessage"
          />
        </div>
      </q-card-actions>

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const LOCAL_STORAGE_KEY = 'house_rent_chat_messages'
const messages = ref([])
const newMessage = ref('')
const chatScroll = ref(null)
const fileInput = ref(null)

// --- API / Storage Integration Logic ---
const fetchMessages = () => {
  // Ready for API integration
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    messages.value = JSON.parse(saved)
    scrollToBottom()
  }
}

const saveMessages = () => {
  // Ready for API integration
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages.value))
}

onMounted(() => {
  fetchMessages()
  window.addEventListener('storage', fetchMessages) // Listens for Admin updates across tabs
})
onUnmounted(() => window.removeEventListener('storage', fetchMessages))

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScroll.value) {
      chatScroll.value.setScrollPosition('vertical', 99999, 300)
    }
  })
}

const sendMessage = () => {
  let textToSend = newMessage.value.trim()
  if (!textToSend && newMessage.value.length === 0) {
    textToSend = '👍'
  } else if (!textToSend) {
    return; // Don't send empty spaces
  }

  messages.value.push({ id: Date.now(), sender: 'tenant', text: textToSend })
  saveMessages()

  newMessage.value = ''
  scrollToBottom()
}

// --- Document/File Upload Logic ---
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Ready for API integration (upload to server logic here)
    messages.value.push({ id: Date.now(), sender: 'tenant', text: `📎 File attached: ${file.name}` })
    saveMessages()
    scrollToBottom()
    $q.notify({ message: 'Document sent successfully', color: 'positive', icon: 'check' })
  }
  event.target.value = null // reset input
}

// --- Call Logic ---
const triggerCall = (type) => {
  $q.notify({
    message: `Starting ${type === 'video' ? 'Video' : 'Audio'} Call with Property Manager...`,
    color: 'primary',
    icon: type === 'video' ? 'videocam' : 'call',
    position: 'top'
  })
}
</script>

<style scoped>
.messenger-bg { background-color: #f0f2f5; padding: 20px; }
.messenger-window { width: 100%; max-width: 800px; height: calc(100vh - 100px); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
.header-glass { border-bottom: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.online-dot { bottom: 2px; right: 0px; border: 2px solid white; width: 12px; height: 12px; }
.line-height-tight { line-height: 1.2; }
.border-top { border-top: 1px solid #e0e0e0; }

:deep(.messenger-bubble .q-message-text) {
  border-radius: 18px !important;
  padding: 8px 14px;
  font-size: 15px;
}
:deep(.q-message-sent .q-message-avatar) { display: none; }
:deep(.q-message-sent .q-message-container) { align-items: flex-end; }
:deep(.q-message-received .q-message-text) { background-color: #e4e6eb !important; color: #050505 !important; }

.input-pill { border-radius: 20px; padding: 0 12px; max-height: 100px; }
</style>
