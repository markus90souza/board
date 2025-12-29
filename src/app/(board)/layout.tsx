import type { ReactNode } from 'react'
import { Header } from './_components/header'

type BoardLayoutProps = Readonly<{
  children: ReactNode
}>
const BoardLayout = ({ children }: BoardLayoutProps) => {
  return (
    <div className="max-w-405 w-full mx-auto p-10 flex flex-col gap-8 h-dvh">
      <Header />
      {children}
    </div>
  )
}

export default BoardLayout
