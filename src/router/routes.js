const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "Login", component: () => import("src/pages/LoginPage.vue") },
      {
        path: "register",
        component: () => import("src/pages/RegisterPage.vue"),
      },

      { path: "Home", component: () => import("src/pages/HomePage.vue") },

      {
        path: "Agreement",
        component: () => import("src/pages/AgreementPage.vue"),
      },

      {
        path: "Complaint",
        component: () => import("src/pages/ComplaintPage.vue"),
      },

      { path: "Profile", component: () => import("src/pages/ProfilePage.vue") },
      {
        path: "RentRecord",
        component: () => import("src/pages/RentRecordPage.vue"),
      },
    ],
  },

  // Admin panel

  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "Dashboard",
        component: () => import("src/pages/Admin-Panel/DashboardPage.vue"),
      },
      {
        path: "Account",
        component: () => import("src/pages/Admin-Panel/AccountPage.vue"),
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
        path: "invoices",
        component: () => import("src/pages/Admin-Panel/InvoicePage.vue"),
      },

      {
        path: "notices",
        component: () => import("src/pages/Admin-Panel/NoticePage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
