export default {
  head: {
    title: 'nuxt-crawler',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  target: 'server',

  css: [
  ],

  plugins: [
    { src: '~/plugins/vue-unicons', mode: 'client' }
  ],
  buildModules: [
    'nuxt-vite'
  ],

  serverMiddleware: [
    '~/serverMiddleware/crawler.js',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {},
  build: {}
}
