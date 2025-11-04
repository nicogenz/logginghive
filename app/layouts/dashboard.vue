<script setup lang="ts">
const router = useRouter()
const { $session } = useNuxtApp()
const username = computed(() => $session.user.value?.username || '')

const { execute: logout } = useFetch('/api/v1/sessions/current', {
  method: 'DELETE',
  immediate: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      await $session.refresh()
      navigateTo('/login', { replace: true })
    }
  }
})

const userMenuItems = computed(() => ([
  [
    {
      type: 'label',
      label: username.value,
      avatar: {
        icon: 'i-lucide-user'
      }
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings'
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      onClick: logout
    }
  ]
]))

const projectId = computed(() => router.currentRoute.value.params.projectId)
const sidebarItems = computed(() => projectId.value
  ? ([
      { label: 'Home', icon: 'i-lucide-home', to: `/projects/${projectId.value}`, exact: true },
      { label: 'Api Keys', icon: 'i-lucide-key-round', to: `/projects/${projectId.value}/api-keys` },
      { label: 'Settings', icon: 'i-lucide-settings', to: `/projects/${projectId.value}/settings` }
    ])
  : [])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      class="w-[300px]"
      :ui="{ header: 'border-b border-default', footer: 'border-t border-default' }"
    >
      <template #header>
        <NuxtLink to="/">LoggingHive</NuxtLink>
      </template>
      <template #default>
        <UNavigationMenu
          :items="sidebarItems"
          orientation="vertical"
        />
      </template>
      <template #footer>
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            variant="ghost"
            block
            class="data-[state=open]:bg-elevated"
            :ui="{
              trailingIcon: 'text-dimmed',
              label: 'text-highlighted'
            }"
            :avatar="{ icon: 'i-lucide-user' }"
            :label="username"
            trailing-icon="i-lucide-chevrons-up-down"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>
