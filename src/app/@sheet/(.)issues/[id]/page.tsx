
import { Sheet } from "@/components/sheet"
import { BackButton } from "./_components/back-button"
import { DialogTitle } from "@radix-ui/react-dialog"
import { IssueDetails } from "@/app/issues/[id]/_components/issue-details"

interface IssuePageProps {
  params: Promise<{ id: string }>
}

export default async function IssueModal({ params }: IssuePageProps) {
  const { id } = await params

  return (
    <Sheet>
      <div className="flex flex-col gap-4 p-6">
        <BackButton />

        <DialogTitle className="sr-only">Issue details</DialogTitle>

        <IssueDetails issueId={id} />
      </div>
    </Sheet>
  )
}