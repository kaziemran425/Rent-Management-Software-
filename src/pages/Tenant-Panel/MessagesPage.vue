<template>
  <q-page class="q-pa-md page-height bg-grey-1 flex flex-center">
    <div class="fit max-width-container chat-wrapper shadow-3 bg-white">
      <ChatWindow
        chatId="manager_thread"
        chatPartnerName="Property Manager"
        chatPartnerAvatar="https://cdn.quasar.dev/img/avatar2.jpg"
        :isPartnerOnline="isManagerOnline"
        :messages="chatHistory"
        :isLoadingHistory="isLoading"
        :isTyping="isManagerTyping"
        @send-message="handleSendMessage"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ChatWindow from 'src/components/ChatWindow.vue'

// --- STATE ---
const chatHistory = ref([])
const isLoading = ref(true)

// Integration readiness: WebSockets state
const isManagerOnline = ref(true)
const isManagerTyping = ref(false)

const LOCAL_STORAGE_KEY = 'tenant_manager_chat_history'

// --- LIFECYCLE & API READINESS ---
onMounted(() => {
  // 1. "Cache-First" Strategy: Load from Local Storage instantly
  const savedChat = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedChat) {
    chatHistory.value = JSON.parse(savedChat)
    isLoading.value = false // Remove spinner instantly if cache exists
  }

  // 2. Simulate API Call to fetch/sync previous messages from the backend
  setTimeout(() => {
    // Only apply the default mock data if local storage was completely empty
    if (!savedChat) {
      chatHistory.value = [
        { id: 1, text: 'Hello, welcome to Iching Residences. Let us know if you need anything.', time: 'Yesterday', isMine: false },
        { id: 2, text: 'Thank you! Just moved in.', time: 'Yesterday', isMine: true }
      ]
    }
    isLoading.value = false
  }, 800) // 800ms fake network delay
})

// --- LOCAL STORAGE WATCHER ---
// Automatically save to local storage whenever a new message is added
watch(chatHistory, (newHistory) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory))
}, { deep: true })

// --- METHODS ---
const handleSendMessage = (text) => {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // 1. Push the tenant's message to the UI instantly
  chatHistory.value.push({
    id: Date.now(),
    text: text,
    time: timeStr,
    isMine: true
  })

  // 2. INTEGRATION POINT: Emit the message via Socket.io or REST API
  // Example: socket.emit('send_message', { to: 'admin', text: text })

  // 3. Simulate the manager receiving and typing back
  simulateManagerReply()
}

// Simulated WebSocket Event: Manager is typing
const simulateManagerReply = () => {
  setTimeout(() => {
    // Show the typing bubble (INTEGRATION: Triggered by socket 'typing' event)
    isManagerTyping.value = true

    setTimeout(() => {
      // Hide the typing bubble and push the reply (INTEGRATION: Triggered by socket 'receive_message' event)
      isManagerTyping.value = false
      chatHistory.value.push({
        id: Date.now(),
        text: 'Message received! I will review this and get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: false
      })
    }, 2500) // Manager "types" for 2.5 seconds
  }, 1000) // 1 second delay before manager "sees" the message
}
</script>

<style lang="scss" scoped>
.page-height {
  /* Subtract the Quasar header height to prevent double scrollbars */
  height: calc(100vh - 50px);
}

.max-width-container {
  /* On large screens, constrain the chat width so it doesn't stretch too wide */
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
}

.chat-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  /* Subtly lift the chat container off the background */
  box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
}
</style>
