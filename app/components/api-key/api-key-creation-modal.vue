<script setup lang="ts">
const props = defineProps<{ projectId: string }>()
const emit = defineEmits<{ close: [ApiKeyApiDto | null] }>()
const { mapApiErrorsToFormErrors } = useFormValidation()

const state = reactive({ name: '' })
const form = ref()

const { execute: createApiKey, pending: createApiKeyPending } = useFetch('/api/v1/api-keys', {
  method: 'POST',
  body: computed(() => ({
    name: state.name,
    projectId: props.projectId
  })),
  immediate: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      emit('close', response._data!)
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
  <UModal
    :close="{ onClick: () => emit('close', null) }"
    title="Create API Key"
  >
    <template #body>
      <UForm
        ref="form"
        class="space-y-6"
        :state="state"
        @submit="() => createApiKey()"
      >
        <UFormField
          label="Name"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            autofocus
            class="w-full"
            required
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton
          variant="outline"
          label="Cancel"
          @click="emit('close', null)"
        />
        <UButton
          label="Create"
          :loading="createApiKeyPending"
          @click="() => form.submit()"
        />
      </div>
    </template>
  </UModal>
</template>
