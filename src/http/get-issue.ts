
import { IssueSchema } from "@/api/routes/get-issue"
import { clientEnv } from "@/env"

interface GetIssueParams {
  id: string
}

export async function getIssue({ id }: GetIssueParams) {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay
  const url = new URL(`/api/issues/${id}`, clientEnv.NEXT_PUBLIC_API_URL)

  const response = await fetch(url)
  const data = await response.json()

  return IssueSchema.parse(data)
}