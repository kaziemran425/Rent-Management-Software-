import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [], // Array of message objects
    isConnected: false,
    activeChatPartnerId: null,
  }),

  getters: {
    getMessagesByPartner: (state) => {
      // In a real app, you'd filter by partner ID.
      // For now, we return all messages in the state.
      return state.messages;
    },
  },

  actions: {
    connectSocket() {
      // Logic to connect to Socket.io or WebSockets goes here
      this.isConnected = true;
      console.log("Chat socket connected");
    },

    disconnectSocket() {
      this.isConnected = false;
      console.log("Chat socket disconnected");
    },

    sendMessage(text, isMine = true) {
      const newMessage = {
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine,
      };

      this.messages.push(newMessage);

      // MOCK AUTO-REPLY logic for testing UI
      if (isMine) {
        setTimeout(() => {
          this.receiveMessage(
            "Thanks for your message. I will look into this shortly.",
          );
        }, 1500);
      }
    },

    receiveMessage(text) {
      this.sendMessage(text, false);
    },

    clearHistory() {
      this.messages = [];
    },
  },
});
