import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("auth_token") || null,
    role: localStorage.getItem("auth_role") || null, // 'super_admin', 'admin', or 'tenant'
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentRole: (state) => state.role,
    currentUser: (state) => state.user,
  },

  actions: {
    // Simulated Login Action - replace with actual API call
    async login(email, password) {
      try {
        // MOCK API LOGIC: Determine role based on email for testing
        let mockRole = "tenant";
        if (email.includes("super")) mockRole = "super_admin";
        else if (email.includes("admin") || email.includes("landlord"))
          mockRole = "admin";

        const mockData = {
          token: "mock-jwt-token-12345",
          user: { id: 1, email, name: "Test User" },
          role: mockRole,
        };

        this.setAuthData(mockData);
        return mockData;
      } catch (error) {
        throw new Error("Login failed");
      }
    },

    setAuthData(data) {
      this.token = data.token;
      this.user = data.user;
      this.role = data.role;

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_role", data.role);
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_role");
    },
  },
});
