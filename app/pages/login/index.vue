<script setup lang="ts">
definePageMeta({
  middleware: ['is-unauthenticated']
})

const { mapApiErrorsToFormErrors } = useFormValidation()
const { $session } = useNuxtApp()

const state = reactive({
  username: '',
  password: ''
})
const form = ref()

const { execute, pending } = useFetch('/api/v1/sessions', {
  method: 'POST',
  body: computed(() => ({
    username: state.username,
    password: state.password
  })),
  immediate: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      await $session.refresh()
      navigateTo('/', { replace: true })
    }
  },
  onResponseError: ({ response }) => {
    form.value.setErrors(mapApiErrorsToFormErrors(response._data!.data))
  }
})
</script>

<template>
  <div class="h-screen flex items-center justify-center px-4">
    <UPageCard
      variant="subtle"
      class="max-w-sm w-full"
    >
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-2xl text-gray-900 dark:text-white font-bold">
            Login
          </h1>
        </div>
        <UForm
          ref="form"
          class="space-y-6"
          :state="state"
          @submit="() => execute()"
        >
          <UFormField
            label="Username"
            name="username"
          >
            <UInput
              v-model="state.username"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Password"
            name="password"
          >
            <UInput
              v-model="state.password"
              type="password"
              required
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            block
            icon="i-lucide-log-in"
            :loading="pending"
          >
            Login
          </UButton>
        </UForm>
      </div>
    </UPageCard>
  </div>
</template>
