export function useFetchOrganizationsKey() {
  return 'organizations'
}

export function useFetchOrganizations() {
  return useFetch<OrganizationApiDto[]>('/api/v1/organizations', {
    key: useFetchOrganizationsKey()
  })
}
