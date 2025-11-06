<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['is-authenticated']
})

const router = useRouter()
const projectId = router.currentRoute.value.params.projectId as string
const organizationId = router.currentRoute.value.params.organizationId as string

const { data: organization } = await useFetchOrganization({ id: organizationId })
const { data: project } = await useFetchProject({ id: projectId })

if (!project.value || !organization.value || project.value.organizationId !== organizationId) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const projectName = project.value.name
const organizationName = organization.value.name
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <UBreadcrumb :items="[{ label: 'Dashboard', to: '/' }, { label: organizationName, to: `/organizations/${organizationId}` }, { label: projectName }]" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <NuxtPage v-bind="{ project }" />
    </template>
  </UDashboardPanel>
</template>
