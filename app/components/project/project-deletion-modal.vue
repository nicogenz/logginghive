<script setup lang="ts">
const props = defineProps<{ id: string }>()
const emit = defineEmits<{ close: [boolean] }>()

const { execute: deleteProject, pending: deleteProjectPending } = useFetch(`/api/v1/projects/${props.id}`, {
  method: 'DELETE',
  immediate: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      emit('close', true)
    }
  }
})
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    title="Delete Project"
  >
    <template #body>
      <p>Are you sure you want to delete the Project</p>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton
          variant="outline"
          label="Cancel"
          @click="emit('close', false)"
        />
        <UButton
          label="Delete"
          color="error"
          :loading="deleteProjectPending"
          @click="() => deleteProject()"
        />
      </div>
    </template>
  </UModal>
</template>
