interface Props {
  id: string
}

export function useFetchProjectKey(props: Props) {
  return `project-${props.id}`
}

export function useFetchProject(props: Props) {
  return useFetch<ProjectApiDto>(`/api/v1/projects/${props.id}`, {
    key: useFetchProjectKey(props)
  })
}
