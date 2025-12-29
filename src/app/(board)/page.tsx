import type { Metadata } from 'next'
import { connection } from 'next/server'
import { listIssues } from '@/http/list-issues'
import { BoardContent } from './_components/board-content'

export const metadata: Metadata = {
  title: 'Board',
}

interface BoardPageProps {
  searchParams: Promise<{ q?: string }>
}
const BoardPage = async ({ searchParams }: BoardPageProps) => {
  //await connection()
  const { q: search } = await searchParams
  const issues = await listIssues({ search })
  return <BoardContent issues={issues} />
}

export default BoardPage
