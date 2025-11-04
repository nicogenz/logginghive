// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    cookie: {
      session: {
        name: 'logginghive_session',
        expirationInSeconds: '86400'
      }
    }
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: {
        arrowParens: true,
        braceStyle: '1tbs',
        quotes: 'single',
        semi: false,
        commaDangle: 'never'
      }
    }
  }
})
