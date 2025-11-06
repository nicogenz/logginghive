<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['is-authenticated']
})

const router = useRouter()
const organizationId = router.currentRoute.value.params.organizationId as string
const { data: organization } = await useFetchOrganization({ id: organizationId })

if (!organization.value) {
  throw createError({ statusCode: 404, statusMessage: 'Organization not found', fatal: true })
}

const organizationName = organization.value.name
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #left>
          <UBreadcrumb :items="[{ label: 'Dashboard', to: '/' }, { label: organizationName }]" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPage>
        <UPageHeader
            :title="organizationName"
            :ui="{ title: 'text-xl sm:text-xl font-medium' }"
        />
        <UPageBody>
          <UPageGrid>
            <ProjectProvider v-for="project in organization!.projects" :key="project" :id="project" :organization-id="organizationId">
              <template #default="project">
                <UPageCard :title="project.name" :to="`/organizations/${organizationId}/projects/${project.id}`" />
              </template>
            </ProjectProvider>
          </UPageGrid>
        </UPageBody>
      </UPage>
    </template>
  </UDashboardPanel>
</template>
