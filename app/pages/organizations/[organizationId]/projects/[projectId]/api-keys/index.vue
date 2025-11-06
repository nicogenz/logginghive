<script setup lang="ts">
import { ApiKeyCreationModal } from '#components'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{ project: ProjectApiDto }>()

const { data: apiKeys } = await useFetchApiKeys({ projectId: props.project.id })
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { id: 'action' }
]

const toast = useToast()
const overlay = useOverlay()
const createApiKeyModal = overlay.create(ApiKeyCreationModal)

const openApiKeyCreationModal = async () => {
  const instance = createApiKeyModal.open({ projectId: props.project.id })
  const apiKey = await instance.result as ApiKeyApiDto
  if (apiKey) {
    toast.add({
      title: `Api Key "${apiKey.name}" was successfully created`,
      color: 'success'
    })
    refreshNuxtData(useFetchApiKeysKey({ projectId: props.project.id }))
  }
}

const getActionItems = (apiKey: ApiKeyApiDto): DropdownMenuItem[] => {
  return [
    {
      label: 'Copy',
      icon: 'i-lucide-copy',
      onSelect: () => {
        navigator.clipboard.writeText(apiKey.token)
        toast.add({
          title: 'API Key copied to clipboard',
          color: 'success'
        })
      }
    },
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error'
    }
  ]
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="API Keys"
      :ui="{ title: 'text-xl sm:text-xl font-medium' }"
      :links="[{ label: 'Create API Key', icon: 'i-lucide-plus', onClick: openApiKeyCreationModal }]"
    />
    <UPageBody>
      <UPageCard>
        <UTable
          :data="apiKeys"
          :columns="columns"
        >
          <template #action-cell="{ row }">
            <UDropdownMenu :items="getActionItems(row.original)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                color="neutral"
                variant="ghost"
              />
            </UDropdownMenu>
          </template>
        </UTable>
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
