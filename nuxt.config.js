export default defineNuxtConfig({
  target: 'static',
  // auto import components
  components: true,
  // server side rendering mode
  ssr: false,

  // app
  app: {
    head: {
      title: 'Nuxt 3 test-project',
      titleTemplate: '%s - Nuxt 3 test-project',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Nuxt 3 test-project',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: '',
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
        },
      ],

    },
  },
  css: ["@/assets/styles/main.scss"],
  modules: [
    '@nuxtjs/style-resources',
    '@pinia/nuxt'
  ],
  buildModules: [
    '@pinia/nuxt',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/_variables.scss";',
        },
      },
    },
  }

})
