<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['is-authenticated']
})

const { mapApiErrorsToFormErrors } = useFormValidation()

const state = reactive({ currentPassword: '', newPassword: '' })
const form = ref()
const toast = useToast()

const { execute: updatePassword, pending: updatePasswordLoading } = useFetch('/api/v1/users/current/update-password', {
  method: 'POST',
  body: computed(() => ({
    currentPassword: state.currentPassword,
    newPassword: state.newPassword
  })),
  immediate: false,
  watch: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      toast.add({
        title: `Your password has been updated successfully.`,
        color: 'success'
      })
      state.currentPassword = ''
      state.newPassword = ''
    }
  },
  onResponseError: ({ response }) => {
    if (response.status === 400) {
      form.value.setErrors(mapApiErrorsToFormErrors(response._data!.data))
    }
  }
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Settings" />
    </template>
    <template #body>
      <UPage>
        <UPageHeader
          title="Settings"
          :ui="{ title: 'text-xl sm:text-xl font-medium' }"
        />
        <UPageBody>
          <UPageCard
            class="mt-4"
            title="Update password"
          >
            <UForm
              ref="form"
              class="space-y-6"
              :state="state"
              @submit="() => updatePassword()"
            >
              <UFormField
                label="Current password"
                name="currentPassword"
                required
              >
                <UInput
                  v-model="state.currentPassword"
                  class="w-full"
                  type="password"
                />
              </UFormField>
              <UFormField
                label="New password"
                name="newPassword"
                required
              >
                <UInput
                  v-model="state.newPassword"
                  class="w-full"
                  type="password"
                />
              </UFormField>
              <div class="w-full flex justify-end">
                <UButton
                  label="Update password"
                  :loading="updatePasswordLoading"
                  @click="() => form.submit()"
                />
              </div>
            </UForm>
          </UPageCard>
        </UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
