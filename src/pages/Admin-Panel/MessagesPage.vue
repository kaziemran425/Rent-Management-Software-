<template>
  <q-page class="bg-white flex">
    <div class="full-width row no-wrap messenger-container">

      <div class="col-12 col-md-4 col-lg-3 column border-right bg-white">
        <div class="q-pa-md row items-center justify-between">
          <div class="text-h5 text-weight-bolder text-dark">Chats</div>
          <div class="q-gutter-xs">
            <q-btn round dense flat icon="more_horiz" class="bg-grey-2" />
            <q-btn round dense flat icon="video_call" class="bg-grey-2" @click="triggerCall('video')" />
            <q-btn round dense flat icon="edit_square" class="bg-grey-2" />
          </div>
        </div>

        <div class="q-px-md q-pb-sm">
          <q-input
            v-model="searchQuery"
            rounded
            outlined
            dense
            bg-color="grey-2"
            color="primary"
            placeholder="Search Tenants"
            borderless
            class="search-pill"
          >
            <template v-slot:prepend><q-icon name="search" size="sm" /></template>
          </q-input>
        </div>

        <q-scroll-area class="col">
          <q-list>
            <q-item
              v-for="tenant in filteredTenants"
              :key="tenant.id"
              clickable
              v-ripple
              class="q-py-sm"
              :class="{ 'active-chat': tenant.id === activeTenantId }"
            >
              <q-item-section avatar>
                <q-avatar size="50px">
                  <img :src="tenant.avatar">
                  <q-badge v-if="tenant.online" floating rounded color="positive" class="online-dot" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-dark">{{ tenant.name }} ({{ tenant.room }})</q-item-label>
                <q-item-label caption lines="1" class="text-dark text-weight-medium">{{ tenant.status }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="filteredTenants.length === 0">
              <q-item-section class="text-center text-grey">No tenants found</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>

      <div class="col-12 col-md-8 col-lg-9 column bg-white relative-position">

        <q-card-section class="header-glass row items-center q-pa-sm q-px-md z-top">
          <q-avatar size="40px" class="q-mr-sm cursor-pointer">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            <q-badge floating rounded color="positive" class="online-dot" />
          </q-avatar>
          <div class="col cursor-pointer">
            <div class="text-subtitle1 text-weight-bold line-height-tight text-dark">Kazi Emran</div>
            <div class="text-caption text-grey-6 line-height-tight">Active now</div>
          </div>
          <div class="q-gutter-xs text-primary">
            <q-btn flat round dense icon="call" @click="triggerCall('audio')" />
            <q-btn flat round dense icon="videocam" @click="triggerCall('video')" />
            <q-btn flat round dense icon="info" />
          </div>
        </q-card-section>

        <q-scroll-area ref="chatScroll" class="col q-pa-md chat-area">
          <div class="text-center q-mb-lg q-mt-md column items-center">
            <q-avatar size="80px" class="q-mb-sm shadow-1">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-h6 text-weight-bold text-dark">Kazi Emran</div>
            <div class="text-caption text-grey-6">Tenant • Flat A-101</div>
          </div>

          <div v-for="msg in messages" :key="msg.id">
            <q-chat-message
              :name="msg.sender === 'admin' ? '' : 'Kazi Emran'"
              :avatar="msg.sender === 'admin' ? '' : 'https://cdn.quasar.dev/img/boy-avatar.png'"
              :text="[msg.text]"
              :sent="msg.sender === 'admin'"
              :bg-color="msg.sender === 'admin' ? 'primary' : 'grey-2'"
              :text-color="msg.sender === 'admin' ? 'white' : 'dark'"
              class="messenger-bubble q-mb-sm"
            />
          </div>
        </q-scroll-area>

        <q-card-actions class="bg-white q-pa-sm row items-end z-top">
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
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const LOCAL_STORAGE_KEY = 'house_rent_chat_messages'
const messages = ref([])
const newMessage = ref('')
const chatScroll = ref(null)
const fileInput = ref(null)

// --- Search Functionality ---
const searchQuery = ref('')
const activeTenantId = ref(1)
const tenantsData = ref([
  { id: 1, name: 'Kazi Emran', room: 'A-101', status: 'Tenant Dashboard Sync Active', online: true, avatar: 'https://cdn.quasar.dev/img/boy-avatar.png' },
  { id: 2, name: 'Rahul Ahmed', room: 'B-205', status: 'Offline', online: false, avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { id: 3, name: 'Sarah Khan', room: 'C-302', status: 'Online', online: true, avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' },
  { id: 4, name: 'Jamil Hasan', room: 'A-105', status: 'Offline', online: false, avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' }
])

const filteredTenants = computed(() => {
  return tenantsData.value.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tenant.room.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// --- API / Storage Integration Logic ---
const fetchMessages = () => {
  // Ready for API integration: Replace this with axios.get('/api/messages')
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (saved) {
    messages.value = JSON.parse(saved)
    scrollToBottom()
  }
}

const saveMessages = () => {
  // Ready for API integration: Replace this with axios.post('/api/messages', payload)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages.value))
}

onMounted(() => {
  fetchMessages()
  window.addEventListener('storage', fetchMessages) // Listens for Tenant updates across tabs
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

  messages.value.push({ id: Date.now(), sender: 'admin', text: textToSend })
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
    // Ready for API integration: You would upload 'file' via FormData here.
    messages.value.push({ id: Date.now(), sender: 'admin', text: `📎 File attached: ${file.name}` })
    saveMessages()
    scrollToBottom()
    $q.notify({ message: 'Document sent successfully', color: 'positive', icon: 'check' })
  }
  // reset input so same file can be uploaded again if needed
  event.target.value = null
}

// --- Call Logic ---
const triggerCall = (type) => {
  $q.notify({
    message: `Starting ${type === 'video' ? 'Video' : 'Audio'} Call with Kazi Emran...`,
    color: 'primary',
    icon: type === 'video' ? 'videocam' : 'call',
    position: 'top'
  })
}
</script>

<style scoped>
.messenger-container { height: calc(100vh - 50px); overflow: hidden; }
.border-right { border-right: 1px solid rgba(0, 0, 0, 0.1); }
.header-glass { border-bottom: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.search-pill :deep(.q-field__control) { border-radius: 20px !important; }
.active-chat { background-color: #ebf5ff; border-radius: 8px; margin: 0 8px; }
.online-dot { bottom: 2px; right: 0px; border: 2px solid white; width: 14px; height: 14px; }
.line-height-tight { line-height: 1.2; }

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
