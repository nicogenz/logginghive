export default defineNuxtPlugin({
  name: 'session-plugin',
  enforce: 'pre',
  setup: async () => {
    const { data, status, refresh } = await useFetch('/api/v1/sessions/current')

    return {
      provide: {
        session: {
          hasValidSession: computed(() => status.value === 'success'),
          user: computed(() => data.value?.user),
          refresh
        }
      }
    }
  }
})
