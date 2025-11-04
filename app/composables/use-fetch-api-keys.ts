interface Props {
  projectId: string
}

export function useFetchApiKeysKey({ projectId }: Props) {
  return `api_keys-${projectId}`
}

export function useFetchApiKeys({ projectId }: Props) {
  return useFetch<ApiKeyApiDto[]>('/api/v1/api-keys', {
    key: useFetchApiKeysKey({ projectId }),
    query: {
      projectId
    }
  })
}
