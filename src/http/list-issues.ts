import { IssuesListResponseSchema } from '@/api/routes/list-issues'
import { clientEnv } from '@/env'

interface ListIssuesParams {
  search?: string
}

const listIssues = async ({ search }: ListIssuesParams = {}) => {
  const url = new URL('/api/issues', clientEnv.NEXT_PUBLIC_API_URL)

  if (search) {
    url.searchParams.set('search', search)
  }

  console.log('Fetching issues from:', url.toString())

  const response = await fetch(url)

  const data = await response.json()

  return IssuesListResponseSchema.parse(data)
}

export { listIssues }
