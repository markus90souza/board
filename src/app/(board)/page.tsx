import { Section } from '@/components/section'
import { Card } from '@/components/card'

import { MessageCircleIcon, ArchiveIcon, ThumbsUpIcon } from 'lucide-react'
import { Button } from '@/components/button'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { listIssues } from '@/http/list-issues'

export const metadata: Metadata = {
  title: 'Board',
}

interface BoardPageProps {
  searchParams: Promise<{ q?: string }>
}
const BoardPage = async ({ searchParams }: BoardPageProps) => {
  await connection()
  const { q: search } = await searchParams
  const issues = await listIssues({ search })
  return (
    <main className="grid grid-cols-1 md:grid-cols-4 gap-5 flex-1">
      <Section.Container>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Backlog
          </Section.Title>
          <Section.IssueCount>{issues.backlog.length}</Section.IssueCount>
        </Section.Header>
        <Section.Content>
          {issues.backlog.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.backlog.map((issue) => (
              <Card.Container href={`/issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>
                <Card.Footer>
                  <Button>
                    <ThumbsUpIcon className="size-3" />
                    <span className="text-sm">12</span>
                  </Button>

                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-sm">6</span>
                  </Button>
                </Card.Footer>
              </Card.Container>
            ))
          )}
        </Section.Content>
      </Section.Container>

      <Section.Container>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            To-do
          </Section.Title>

          <Section.IssueCount>{issues.todo.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.todo.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.todo.map((issue) => (
              <Card.Container href={`/issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>
                <Card.Footer>
                  <Button>
                    <ThumbsUpIcon className="size-3" />
                    <span className="text-sm">12</span>
                  </Button>

                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-sm">6</span>
                  </Button>
                </Card.Footer>
              </Card.Container>
            ))
          )}
        </Section.Content>
      </Section.Container>

      <Section.Container>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            In progress
          </Section.Title>

          <Section.IssueCount>{issues.in_progress.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.in_progress.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.in_progress.map((issue) => (
              <Card.Container href={`/issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>
                <Card.Footer>
                  <Button>
                    <ThumbsUpIcon className="size-3" />
                    <span className="text-sm">12</span>
                  </Button>

                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-sm">6</span>
                  </Button>
                </Card.Footer>
              </Card.Container>
            ))
          )}
        </Section.Content>
      </Section.Container>

      <Section.Container>
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Done
          </Section.Title>

          <Section.IssueCount>{issues.done.length}</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          {issues.done.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <p className="text-sm text-navy-300">
                No issues matching your filters
              </p>
            </div>
          ) : (
            issues.done.map((issue) => (
              <Card.Container href={`/issues/${issue.id}`} key={issue.id}>
                <Card.Header>
                  <Card.Number>ISS-{issue.issueNumber}</Card.Number>
                  <Card.Title>{issue.title}</Card.Title>
                </Card.Header>
                <Card.Footer>
                  <Button>
                    <ThumbsUpIcon className="size-3" />
                    <span className="text-sm">12</span>
                  </Button>

                  <Button>
                    <MessageCircleIcon className="size-3" />
                    <span className="text-sm">6</span>
                  </Button>
                </Card.Footer>
              </Card.Container>
            ))
          )}
        </Section.Content>
      </Section.Container>
    </main>
  )
}

export default BoardPage
