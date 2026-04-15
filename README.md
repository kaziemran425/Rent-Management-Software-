# Quasar App (rent-management-vue)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).



rent-management-vue
├─ .editorconfig
├─ .npmrc
├─ README.md
├─ babel.config.js
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  └─ icons
│     ├─ favicon-128x128.png
│     ├─ favicon-16x16.png
│     ├─ favicon-32x32.png
│     └─ favicon-96x96.png
├─ quasar.config.js
└─ src
   ├─ App.vue
   ├─ assets
   │  ├─ quasar-logo-vertical.svg
   │  └─ social-assets
   │     ├─ apple-logo.jpeg
   │     ├─ facebook.jpg
   │     └─ google-logo.png
   ├─ boot
   │  └─ axios.js
   ├─ components
   │  └─ EssentialLink.vue
   ├─ css
   │  ├─ app.scss
   │  └─ quasar.variables.scss
   ├─ layouts
   │  ├─ AdminLayout.vue
   │  └─ MainLayout.vue
   ├─ pages
   │  ├─ Admin-Panel
   │  │  ├─ AccountPage.vue
   │  │  ├─ BuildingPage.vue
   │  │  ├─ DashboardPage.vue
   │  │  ├─ FlatPage.vue
   │  │  ├─ InvoicePage.vue
   │  │  ├─ NoticePage.vue
   │  │  └─ TenantPage.vue
   │  ├─ AgreementPage.vue
   │  ├─ ComplaintPage.vue
   │  ├─ ErrorNotFound.vue
   │  ├─ HomePage.vue
   │  ├─ IndexPage.vue
   │  ├─ LoginPage.vue
   │  ├─ ProfilePage.vue
   │  ├─ RegisterPage.vue
   │  └─ RentRecordPage.vue
   ├─ router
   │  ├─ index.js
   │  └─ routes.js
   └─ stores
      ├─ example-store.js
      ├─ index.js
      └─ store-flag.d.ts

