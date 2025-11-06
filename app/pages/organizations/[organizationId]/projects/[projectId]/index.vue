<script setup lang="ts">
const props = defineProps<{ project: ProjectApiDto }>()

const { data: logEntries } = await useFetchLogEntries({ projectId: props.project.id })
const columns = [
  { accessorKey: 'timestamp', header: 'Timestamp' },
  { accessorKey: 'level', header: 'Level' },
  { accessorKey: 'message', header: 'Message' }
]
</script>

<template>
  <UPage>
    <UPageHeader
      title="Home"
      :ui="{ title: 'text-xl sm:text-xl font-medium' }"
    />
    <UPageBody>
      <UPageCard>
        <UTable
          :data="logEntries"
          :columns="columns"
          sticky
          class="max-h-[500px]"
        />
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
