export function useFetchProjectsKey() {
  return `projects`
}

export function useFetchProjects() {
  return useFetch<ProjectApiDto[]>('/api/v1/projects', {
    key: useFetchProjectsKey()
  })
}
