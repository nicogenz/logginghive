<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { ProjectDeletionModal } from '#components'

const props = defineProps<{ project: ProjectApiDto }>()

const toast = useToast()
const overlay = useOverlay()
const deleteProjectModal = overlay.create(ProjectDeletionModal)

const openProjectDeletionModal = async () => {
  const instance = deleteProjectModal.open({ id: props.project.id })
  if (await instance.result) {
    toast.add({
      title: `Project "${props.project.name}" was successfully deleted`,
      color: 'success'
    })
    await refreshNuxtData(useFetchProjectsKey({ organizationId: props.project.organizationId }))
    navigateTo('/', { replace: true })
  }
}
const { copy, copied } = useClipboard()
const copyProjectId = () => {
  copy(props.project.id)
  toast.add({
    title: 'Successfully copied',
    description: 'Project ID copied to clipboard',
    icon: 'i-lucide-copy-check',
    color: 'success'
  })
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Settings"
      :ui="{ title: 'text-xl sm:text-xl font-medium' }"
    />
    <UPageBody>
      <UPageCard class="mt-4">
        <UFormField
          label="Project ID"
          description="This is your unique project identifier. You will need it when calling the API."
        >
          <UInput
            disabled
            :model-value="project.id"
            class="w-full"
          >
            <template #trailing>
              <UTooltip
                text="Copy to clipboard"
                :content="{ side: 'right' }"
              >
                <UButton
                  :color="copied ? 'success' : 'neutral'"
                  variant="link"
                  :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
                  @click="copyProjectId"
                />
              </UTooltip>
            </template>
          </UInput>
        </UFormField>
      </UPageCard>
      <UPageCard
        title="Delete Project"
        description="No longer want to use our service? You can delete your project here. This action is not reversible. All information related to this project will be deleted permanently. We are not able to recover it."
        class="mt-10 bg-gradient-to-tl from-(--ui-error)/10 from-5% to-(--ui-bg)"
      >
        <template #footer>
          <UButton
            label="Delete project"
            color="error"
            @click="openProjectDeletionModal"
          />
        </template>
      </UPageCard>
    </UPageBody>
  </UPage>
</template>
