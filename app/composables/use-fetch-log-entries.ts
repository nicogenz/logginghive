interface Props {
  projectId: string
}

export function useFetchLogEntriesKey({ projectId }: Props) {
  return `log_entries-${projectId}`
}

export function useFetchLogEntries({ projectId }: Props) {
  return useFetch<LogEntryApiDto[]>('/api/v1/log-entries', {
    key: useFetchLogEntriesKey({ projectId }),
    query: {
      projectId
    }
  })
}
