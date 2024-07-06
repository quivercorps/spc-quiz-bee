// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/',
      appUrl: process.env.NUXT_PUBLIC_URL || 'http://localhost:3000/'
    }
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  }
})
