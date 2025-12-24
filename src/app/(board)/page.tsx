import { Section } from '@/components/section'
import { Card } from '@/components/card'

import { MessageCircleIcon, ArchiveIcon, ThumbsUpIcon } from 'lucide-react'
import { Button } from '@/components/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Board",
}

interface BoardPageProps {
  searchParams: Promise<{ q?: string }>
}
const BoardPage = async ({ searchParams }: BoardPageProps) => {
  const { q: search } = await searchParams
  console.log('Search query:', search)
  return (
    <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
      <Section.Container>
        {/* Header */}
        <Section.Header>
          <Section.Title>
            <ArchiveIcon className="size-3" />
            Backlog
          </Section.Title>
          <Section.IssueCount>16</Section.IssueCount>
        </Section.Header>

        {/* Content */}
        <Section.Content>
          <Card.Container>
            <Card.Header>
              <Card.Number>ECO-001</Card.Number>
              <Card.Title>Implementar cartão de crédito</Card.Title>
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
        </Section.Content>
      </Section.Container>
    </main>
  )
}

export default BoardPage
