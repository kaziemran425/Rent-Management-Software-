<template>
  <q-card class="chat-window column no-wrap" bordered>
    <q-card-section class="bg-primary text-white row items-center q-pa-sm">
      <q-avatar size="40px" class="q-mr-sm">
        <img :src="chatPartnerAvatar" :alt="chatPartnerName">
      </q-avatar>
      <div class="text-subtitle1 text-weight-bold">{{ chatPartnerName }}</div>
      <q-space />
      <q-btn flat round dense icon="more_vert">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Clear History</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-section>

    <q-scroll-area ref="chatScrollArea" class="col q-pa-md bg-grey-2">
      <div v-if="messages.length === 0" class="text-center text-grey-6 q-mt-md">
        No messages yet. Start the conversation!
      </div>

      <div v-for="(msg, index) in messages" :key="index">
        <q-chat-message
          :name="msg.isMine ? 'Me' : chatPartnerName"
          :avatar="msg.isMine ? currentUserAvatar : chatPartnerAvatar"
          :text="[msg.text]"
          :stamp="msg.time"
          :sent="msg.isMine"
          :bg-color="msg.isMine ? 'primary' : 'white'"
          :text-color="msg.isMine ? 'white' : 'dark'"
        />
      </div>
    </q-scroll-area>

    <q-card-actions class="bg-white q-pa-sm row items-end">
      <q-input
        v-model="newMessage"
        class="col"
        dense
        outlined
        placeholder="Type a message..."
        autogrow
        @keyup.enter="sendMessage"
      >
        <template v-slot:after>
          <q-btn
            round
            dense
            flat
            icon="send"
            color="primary"
            @click="sendMessage"
            :disable="!newMessage.trim()"
          />
        </template>
      </q-input>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  chatPartnerName: {
    type: String,
    default: 'Support'
  },
  chatPartnerAvatar: {
    type: String,
    default: 'https://cdn.quasar.dev/img/avatar5.jpg'
  },
  currentUserAvatar: {
    type: String,
    default: 'https://cdn.quasar.dev/img/avatar4.jpg'
  },
  /**
   * Expected format:
   * [{ text: 'Hello', time: '10:00 AM', isMine: false }, ...]
   */
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['send-message'])

const newMessage = ref('')
const chatScrollArea = ref(null)

const sendMessage = () => {
  if (newMessage.value.trim() === '') return

  // Emit the text to the parent view to handle API/Socket sending
  emit('send-message', newMessage.value)

  // Clear input
  newMessage.value = ''
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages, async () => {
  await nextTick()
  if (chatScrollArea.value) {
    chatScrollArea.value.setScrollPercentage('vertical', 1.0, 300)
  }
}, { deep: true })
</script>

<style scoped>
/* Ensure the chat window takes up available height in its container */
.chat-window {
  height: 100%;
  min-height: 500px;
  max-height: calc(100vh - 120px);
}
</style>
