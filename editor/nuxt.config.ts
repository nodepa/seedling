// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['@aws-amplify/ui-vue/styles.css', '~/assets/css/main.css'],
  app: {
    head: {
      title: 'Seedlingo Apiary',
    },
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'accent',
        'info',
        'warning',
        'error',
        'success',
        'gray',
      ],
    },
  },
});
