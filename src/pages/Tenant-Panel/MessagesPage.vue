<template>
  <q-page class="q-pa-md" style="height: calc(100vh - 50px);">
    <ChatWindow
      chatPartnerName="Property Manager"
      chatPartnerAvatar="https://cdn.quasar.dev/img/avatar2.jpg"
      :messages="chatHistory"
      @send-message="handleSendMessage"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ChatWindow from 'src/components/ChatWindow.vue'

// Mock chat history
const chatHistory = ref([
  { text: 'Hello, welcome to Iching Residences. Let us know if you need anything.', time: 'Yesterday', isMine: false },
  { text: 'Thank you! Just moved in.', time: 'Yesterday', isMine: true }
])

const handleSendMessage = (text) => {
  chatHistory.value.push({
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMine: true
  })

  // Here you would send the message to your API/Socket
}
</script>
