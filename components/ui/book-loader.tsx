/** A tiny book with flipping pages, used instead of a spinner (CSS only). */
export const BookLoader = ({ label = 'Loading' }: { label?: string }) => (
  <div role="status" aria-label={label} className="book-loader">
    <span />
    <span />
    <span />
  </div>
)
