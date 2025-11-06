<script setup lang="ts">
const props = defineProps<{ id: string, organizationId: string }>()

const { data: project } = await useFetchProject({ id: props.id, organizationId: props.organizationId })
</script>

<template>
  <div>
    <slot
      v-if="project"
      v-bind="project"
    />
    <slot
      v-else
      name="error"
    />
  </div>
</template>
