import { BookLoader } from '@/components/ui/book-loader'

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <BookLoader />
    </div>
  )
}
