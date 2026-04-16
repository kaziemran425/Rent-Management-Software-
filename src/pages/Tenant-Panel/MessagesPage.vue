<template>
  <q-page class="q-pa-md page-height flex flex-center">
    <div class="fit max-width-container chat-wrapper shadow-2 bg-white">
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
import { ref, onMounted } from 'vue'
import ChatWindow from 'src/components/ChatWindow.vue'

// --- STATE ---
const chatHistory = ref([])
const isLoading = ref(true)

// Integration readiness: WebSockets state
const isManagerOnline = ref(true)
const isManagerTyping = ref(false)

// --- LIFECYCLE ---
onMounted(() => {
  // 1. Simulate API Call to fetch previous messages
  // In a real app, you would fetch this from your backend based on the tenant's ID
  setTimeout(() => {
    chatHistory.value = [
      { id: 1, text: 'Hello, welcome to Iching Residences. Let us know if you need anything.', time: 'Yesterday', isMine: false },
      { id: 2, text: 'Thank you! Just moved in.', time: 'Yesterday', isMine: true }
    ]
    isLoading.value = false
  }, 800) // 800ms fake network delay
})

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

  // 2. Here you would emit the message via Socket.io or REST API
  // e.g., socket.emit('send_message', { to: 'admin', text: text })

  // 3. Simulate the manager receiving and typing back
  simulateManagerReply()
}

// Simulated WebSocket Event: Manager is typing
const simulateManagerReply = () => {
  setTimeout(() => {
    // Show the typing bubble
    isManagerTyping.value = true

    setTimeout(() => {
      // Hide the typing bubble and push the reply
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
  /* Subtract the Quasar header height (approx 50px) to prevent double scrollbars */
  height: calc(100vh - 50px);
}

.max-width-container {
  /* On large screens, constrain the chat width so it doesn't stretch too wide */
  max-width: 900px;
  margin: 0 auto;
}

.chat-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
</style>
