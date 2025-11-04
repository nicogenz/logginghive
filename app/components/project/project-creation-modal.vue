<script setup lang="ts">
const emit = defineEmits<{ close: [ProjectApiDto | null] }>()
const { mapApiErrorsToFormErrors } = useFormValidation()

const state = reactive({ name: '' })
const form = ref()

const { execute: createProject, pending: createProjectPending } = useFetch('/api/v1/projects', {
  method: 'POST',
  body: computed(() => ({
    name: state.name
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
    title="Create Project"
  >
    <template #body>
      <UForm
        ref="form"
        class="space-y-6"
        :state="state"
        @submit="() => createProject()"
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
          :loading="createProjectPending"
          @click="() => form.submit()"
        />
      </div>
    </template>
  </UModal>
</template>
