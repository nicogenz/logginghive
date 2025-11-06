interface Props {
  id: string
}

export function useFetchOrganizationKey({ id }: Props) {
  return `organization-${id}`
}

export function useFetchOrganization({ id }: Props) {
  return useFetch<OrganizationApiDto>(`/api/v1/organizations/${id}`, {
    key: useFetchOrganizationKey({ id })
  })
}
