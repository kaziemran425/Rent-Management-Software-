<template>
  <q-page class="q-pa-md page-height">
    <q-card class="fit shadow-2 chat-container" flat bordered>
      <q-splitter v-model="splitterModel" class="fit" :limits="[25, 40]">

        <template v-slot:before>
          <div class="column fit bg-white">

            <div class="q-pa-md row items-center justify-between header-border">
              <div class="text-h5 text-weight-bold tracking-tight">Chats</div>
              <div class="q-gutter-xs">
                <q-btn flat round dense color="grey-8" icon="more_horiz" />
                <q-btn flat round dense color="primary" icon="edit_square" />
              </div>
            </div>

            <div class="q-px-md q-pb-sm q-pt-md">
              <q-input
                v-model="search"
                dense
                borderless
                class="search-pill bg-grey-2"
                placeholder="Search Messenger"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="grey-6" class="q-pl-sm" />
                </template>
                <template v-slot:append v-if="search">
                  <q-icon name="close" @click="search = ''" class="cursor-pointer" />
                </template>
              </q-input>
            </div>

            <q-scroll-area class="col custom-scroll">
              <q-list class="q-px-sm">
                <div v-if="filteredContacts.length === 0" class="text-center text-grey-6 q-mt-md">
                  No tenants found.
                </div>

                <q-item
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  clickable
                  class="contact-item q-mb-xs"
                  :class="{ 'active-contact': activeContact?.id === contact.id }"
                  @click="selectContact(contact)"
                >
                  <q-item-section avatar>
                    <q-avatar size="48px" class="relative-position">
                      <img :src="contact.avatar" :alt="contact.name">
                      <q-badge floating rounded color="positive" class="online-dot" v-if="contact.online" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold" :class="{'text-primary': contact.unread > 0}">
                      {{ contact.name }}
                    </q-item-label>
                    <q-item-label caption lines="1" class="text-grey-7" :class="{'text-weight-bold text-dark': contact.unread > 0}">
                      <span v-if="contact.isTyping" class="text-primary text-italic">Typing...</span>
                      <span v-else>{{ contact.lastMessage }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption class="q-mt-xs">{{ contact.lastMessageTime }}</q-item-label>
                    <q-badge color="primary" rounded v-if="contact.unread > 0" class="q-mt-xs">
                      {{ contact.unread }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </template>

        <template v-slot:after>
          <div v-if="activeContact" class="fit">
            <ChatWindow
              :chatId="activeContact.id"
              :chatPartnerName="activeContact.name"
              :chatPartnerAvatar="activeContact.avatar"
              :isPartnerOnline="activeContact.online"
              :messages="currentMessages"
              :isLoadingHistory="isLoadingHistory"
              :isTyping="activeContact.isTyping"
              @send-message="handleNewMessage"
            />
          </div>

          <div v-else class="fit column flex-center bg-grey-1 text-center">
            <q-avatar size="100px" color="blue-1" text-color="primary" icon="forum" class="q-mb-md" />
            <div class="text-h5 text-weight-bold">Select a thread</div>
            <div class="text-grey-6">Choose a tenant from the list to start messaging</div>
          </div>
        </template>

      </q-splitter>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChatWindow from 'src/components/ChatWindow.vue'

// --- STATE ---
const splitterModel = ref(32) // 32% width for the sidebar looks standard
const search = ref('')
const isLoadingHistory = ref(false)
const activeContact = ref(null)
const currentMessages = ref([])

const LOCAL_STORAGE_KEY = 'admin_last_chat_id'

// Mock Data structure designed for API integration
const contacts = ref([
  {
    id: 1,
    name: 'Alice Johnson',
    flat: 'A-101',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    online: true,
    unread: 2,
    lastMessage: 'Hi, when is the plumber coming?',
    lastMessageTime: '09:00 AM',
    isTyping: false
  },
  {
    id: 2,
    name: 'Bob Smith',
    flat: 'B-204',
    avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    online: false,
    unread: 0,
    lastMessage: 'Thanks for the update.',
    lastMessageTime: 'Yesterday',
    isTyping: false
  },
  {
    id: 3,
    name: 'Charlie Brown',
    flat: 'A-102',
    avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
    online: true,
    unread: 0,
    lastMessage: 'Rent paid via bank transfer.',
    lastMessageTime: 'Mon',
    isTyping: false
  }
])

// --- COMPUTED ---
// Smart search filtering by name or flat number
const filteredContacts = computed(() => {
  if (!search.value) return contacts.value
  const term = search.value.toLowerCase()
  return contacts.value.filter(c =>
    c.name.toLowerCase().includes(term) ||
    c.flat.toLowerCase().includes(term)
  )
})

// --- METHODS ---
const selectContact = (contact) => {
  if (activeContact.value?.id === contact.id) return // Don't reload if already active

  activeContact.value = contact

  // Clear unread count locally
  contact.unread = 0

  // Save to local storage so page refresh remembers the chat
  localStorage.setItem(LOCAL_STORAGE_KEY, contact.id)

  // Simulate API Call to fetch messages
  isLoadingHistory.value = true
  currentMessages.value = [] // clear old

  setTimeout(() => {
    // Mock response based on user
    if (contact.id === 1) {
      currentMessages.value = [
        { id: 101, text: 'Hi, when is the plumber coming?', time: '09:00 AM', isMine: false }
      ]
    } else {
      currentMessages.value = [
        { id: 102, text: contact.lastMessage, time: contact.lastMessageTime, isMine: false }
      ]
    }
    isLoadingHistory.value = false
  }, 600) // 600ms fake network delay
}

const handleNewMessage = (text) => {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // 1. Push to active chat
  currentMessages.value.push({
    id: Date.now(),
    text: text,
    time: timeStr,
    isMine: true
  })

  // 2. Update the contact list preview (Messenger style)
  if (activeContact.value) {
    activeContact.value.lastMessage = `You: ${text}`
    activeContact.value.lastMessageTime = timeStr

    // Simulate partner typing back after 2 seconds
    simulatePartnerReply(activeContact.value)
  }
}

// Integration readiness: Simulate WebSocket typing events
const simulatePartnerReply = (contact) => {
  setTimeout(() => {
    contact.isTyping = true

    setTimeout(() => {
      contact.isTyping = false
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const replyText = 'Got it, thank you!'

      // If we are still looking at this chat, push to screen
      if (activeContact.value?.id === contact.id) {
        currentMessages.value.push({
          id: Date.now(),
          text: replyText,
          time: replyTime,
          isMine: false
        })
      }
      // Update sidebar preview
      contact.lastMessage = replyText
      contact.lastMessageTime = replyTime

      // If we clicked away, mark as unread
      if (activeContact.value?.id !== contact.id) {
        contact.unread += 1
      }
    }, 2000)
  }, 1500)
}

// --- LIFECYCLE ---
onMounted(() => {
  // Check local storage for the last active chat
  const savedChatId = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedChatId) {
    const contactToLoad = contacts.value.find(c => c.id === parseInt(savedChatId))
    if (contactToLoad) {
      selectContact(contactToLoad)
    }
  }
})
</script>

<style lang="scss" scoped>
.page-height {
  height: calc(100vh - 50px);
}

.chat-container {
  border-radius: 12px;
  overflow: hidden;
}

.header-border {
  border-bottom: 1px solid #e0e0e0;
}

.tracking-tight {
  letter-spacing: -0.02em;
}

/* Messenger Search Pill */
.search-pill {
  border-radius: 20px;
  overflow: hidden;
}

/* Contact List Item Styling */
.contact-item {
  border-radius: 10px;
  transition: background 0.2s ease;
}

.contact-item:hover {
  background: #f5f5f5;
}

/* The active chat gets a distinct subtle highlight */
.active-contact {
  background: #e3f2fd !important; /* light blue */
}

/* Online Dot on Avatar */
.online-dot {
  bottom: 2px;
  right: 0;
  border: 2px solid white;
  width: 14px;
  height: 14px;
}

/* Custom Webkit Scrollbar for sidebar */
.custom-scroll :deep(.q-scrollarea__thumb) {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}
</style>
