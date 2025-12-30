import Link from 'next/link'
import type { Metadata } from 'next'
import { IssueCommentsList } from './_components/issue-comments-list'
import { IssueCommentsListSkeleton } from './_components/issue-comments-list-skeleton'
import { Suspense } from 'react'
import { IssueLikeButton } from './_components/issue-like-button'
import { IssueCommentForm } from './_components/issue-comment-form'
import { authClient } from '@/lib/auth-client'
import { headers } from 'next/headers'
import { createComment } from '@/http/create-comment'

import { MoveLeftIcon, ArchiveIcon } from 'lucide-react'
import { getIssue } from '@/http/get-issue'
import { IssueDetails } from './_components/issue-details'
interface IssuePageProps {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({
  params,
}: IssuePageProps): Promise<Metadata> => {
  const { id } = await params

  const issue = await getIssue({ id })

  return {
    title: `Issue ${issue.title}`,
  }
}

const statusLabels = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
} as const

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params

 
  return (
    <main className="max-w-225 mx-auto w-full flex flex-col gap-4 p-6 bg-navy-800 border-[0.5px] border-navy-500 rounded-xl">
      <Link
        href="/"
        className="flex items-center gap-2 text-navy-200 hover:text-navy-100"
      >
        <MoveLeftIcon className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      <IssueDetails issueId={id} />


    </main>
  )
}
