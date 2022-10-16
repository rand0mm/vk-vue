export default {
  ssr: false,

  target: 'static',

  head: {
    title: 'vk-vue',
    htmlAttrs: {
      lang: 'ru',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'vk-vue' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      },
    ],

  },

  css: [
    '@/assets/styles/main.scss',
  ],

  styleResources: {
    scss: [
      '@/assets/styles/variables.scss',
      '@/assets/styles/mixin.scss',
    ],
  },

  components: true,

  buildModules: [
  ],

  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/style-resources',
  ],
  router: {
    prefetchLinks: false,
    prefetchPayloads: false,
  },

  plugins: [
    '~/plugins/axios.js',
    '~/plugins/portalVue.js',
  ],
  build: {
    postcss: null,
  },
};
