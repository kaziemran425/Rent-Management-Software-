<template>
  <q-page class="q-pa-md" style="height: calc(100vh - 50px);">
    <q-card class="fit shadow-1" bordered>
      <q-splitter v-model="splitterModel" class="fit">

        <template v-slot:before>
          <div class="q-pa-sm">
            <q-input outlined dense v-model="search" placeholder="Search tenants..." class="q-mb-md">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-list separator>
              <q-item
                v-for="contact in contacts"
                :key="contact.id"
                clickable
                v-ripple
                :active="activeContact?.id === contact.id"
                active-class="bg-blue-1 text-primary"
                @click="activeContact = contact"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">{{ contact.name.charAt(0) }}</q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ contact.name }}</q-item-label>
                  <q-item-label caption>{{ contact.flat }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="contact.unread">
                  <q-badge color="orange" rounded>{{ contact.unread }}</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </template>

        <template v-slot:after>
          <div v-if="activeContact" class="fit">
            <ChatWindow
              :chatPartnerName="activeContact.name"
              :messages="currentMessages"
              @send-message="handleNewMessage"
            />
          </div>
          <div v-else class="fit flex flex-center text-grey-6 text-h6">
            Select a tenant to start messaging
          </div>
        </template>

      </q-splitter>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ChatWindow from 'src/components/ChatWindow.vue'

const splitterModel = ref(30) // 30% width for the contact list
const search = ref('')

const contacts = ref([
  { id: 1, name: 'Alice Johnson', flat: 'A-101', unread: 2 },
  { id: 2, name: 'Bob Smith', flat: 'B-204', unread: 0 }
])

const activeContact = ref(null)

// Mock messages
const currentMessages = ref([
  { text: 'Hi, when is the plumber coming?', time: '09:00 AM', isMine: false },
  { text: 'He should be there around 2 PM today.', time: '09:15 AM', isMine: true }
])

const handleNewMessage = (text) => {
  currentMessages.value.push({
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMine: true
  })
  // Here you would emit this to your Socket.io/Backend
}
</script>
