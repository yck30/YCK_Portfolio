import { ReadingProgress } from '@/components/ReadingProgress'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  )
}
