<script setup lang="ts">
import { ProjectCreationModal } from '#components'

definePageMeta({
  layout: 'dashboard',
  middleware: ['is-authenticated']
})

const { data: projects } = await useFetchProjects()

const toast = useToast()
const overlay = useOverlay()
const createProjectModal = overlay.create(ProjectCreationModal)

const openProjectCreationModal = async () => {
  const instance = createProjectModal.open()
  const project = await instance.result as ProjectApiDto
  if (project) {
    toast.add({
      title: `Project "${project.name}" was successfully created`,
      color: 'success'
    })
    refreshNuxtData(useFetchProjectsKey())
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>
    <template #body>
      <div>
        <UPageHeader
          title="Projects"
          :ui="{ title: 'text-xl sm:text-xl font-medium' }"
          :links="[{ label: 'Create project', icon: 'i-lucide-plus', onClick: openProjectCreationModal }]"
        />
        <UPageBody>
          <UEmpty
            v-if="projects && projects.length === 0"
            variant="naked"
            icon="i-lucide-bell"
            title="No Projects"
            description="You have not created any projects yet."
            :actions="[
              {
                icon: 'i-lucide-plus',
                label: 'Create project',
                color: 'neutral',
                variant: 'subtle',
                onClick: openProjectCreationModal
              }
            ]"
          />
          <UPageGrid v-else>
            <UPageCard
              v-for="project in projects"
              :key="project.id"
              :title="project.name"
              :to="`/projects/${project.id}`"
            />
          </UPageGrid>
        </UPageBody>
      </div>
    </template>
  </UDashboardPanel>
</template>
