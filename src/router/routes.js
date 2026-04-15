const routes = [
  // ==========================================
  // PUBLIC ROUTES (Landing Page, Pricing, etc.)
  // ==========================================
  {
    path: "/",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Public/HomePage.vue") },
      {
        path: "pricing",
        component: () => import("src/pages/Public/PricingPage.vue"),
      },
    ],
  },

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================
  {
    path: "/auth",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("src/pages/Auth/LoginPage.vue"),
      },
      {
        path: "register",
        component: () => import("src/pages/Auth/RegisterPage.vue"),
      },
      {
        path: "forgot-password",
        component: () => import("src/pages/Auth/ForgotPasswordPage.vue"),
      },
    ],
  },

  // ==========================================
  // SAAS SUPER ADMIN PORTAL
  // ==========================================
  {
    path: "/super-admin",
    component: () => import("src/layouts/SuperAdminLayout.vue"),
    meta: { requiresAuth: true, role: "super_admin" },
    children: [
      { path: "", redirect: "/super-admin/dashboard" },
      // {
      //   path: "dashboard",
      //   component: () => import("src/pages/SuperAdmin-Panel/DashboardPage.vue"),
      // },
      // Note: Make sure to add routes for LandlordsPage and SubscriptionsPage here later!
    ],
  },

  // ==========================================
  // LANDLORD / ADMIN PORTAL
  // ==========================================
  {
    path: "/admin",
    component: () => import("src/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      {
        path: "dashboard",
        component: () => import("src/pages/Admin-Panel/DashboardPage.vue"),
      },
      {
        path: "buildings",
        component: () => import("src/pages/Admin-Panel/BuildingPage.vue"),
      },
      {
        path: "flats",
        component: () => import("src/pages/Admin-Panel/FlatPage.vue"),
      },
      {
        path: "tenants",
        component: () => import("src/pages/Admin-Panel/TenantPage.vue"),
      },
      {
        path: "agreements",
        component: () =>
          import("src/pages/Admin-Panel/AgreementReviewPage.vue"),
      },
      {
        path: "invoices",
        component: () => import("src/pages/Admin-Panel/InvoicePage.vue"),
      },
      {
        path: "reports",
        component: () => import("src/pages/Admin-Panel/ReportsPage.vue"),
      },
      {
        path: "notices",
        component: () => import("src/pages/Admin-Panel/NoticePage.vue"),
      },
      {
        path: "maintenance",
        component: () => import("src/pages/Admin-Panel/MaintenancePage.vue"),
      },
      {
        path: "messages",
        component: () => import("src/pages/Admin-Panel/MessagesPage.vue"),
      },
      {
        path: "settings",
        component: () => import("src/pages/Admin-Panel/SettingsPage.vue"),
      },
      {
        path: "account",
        component: () => import("src/pages/Admin-Panel/AccountPage.vue"),
      },
    ],
  },

  // ==========================================
  // TENANT PORTAL
  // ==========================================
  {
    path: "/tenant",
    component: () => import("src/layouts/TenantLayout.vue"), // Fixed path
    meta: { requiresAuth: true, role: "tenant" },
    children: [
      { path: "", redirect: "/tenant/dashboard" },
      {
        path: "dashboard",
        component: () =>
          import("src/pages/Tenant-Panel/TenantDashboardPage.vue"),
      },
      {
        path: "rent-records",
        component: () => import("src/pages/Tenant-Panel/RentRecordPage.vue"),
      },
      {
        path: "agreement",
        component: () =>
          import("src/pages/Tenant-Panel/AgreementSubmitPage.vue"),
      },
      {
        path: "notices",
        component: () => import("src/pages/Tenant-Panel/NoticeBoardPage.vue"),
      },
      {
        path: "complaints",
        component: () => import("src/pages/Tenant-Panel/ComplaintPage.vue"),
      },
      {
        path: "messages",
        component: () => import("src/pages/Tenant-Panel/MessagesPage.vue"),
      },
      {
        path: "profile",
        component: () => import("src/pages/Tenant-Panel/ProfilePage.vue"),
      },
    ],
  },

  // ==========================================
  // 404 CATCH-ALL
  // ==========================================
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/ErrorNotFound.vue"), // Fixed path
  },
];

export default routes;
