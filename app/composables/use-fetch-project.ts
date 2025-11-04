interface Props {
  id: string
}

export function useFetchProjectKey({ id }: Props) {
  return `project-${id}`
}

export function useFetchProject({ id }: Props) {
  return useFetch<ProjectApiDto>(`/api/v1/projects/${id}`, {
    key: useFetchProjectKey({ id })
  })
}
