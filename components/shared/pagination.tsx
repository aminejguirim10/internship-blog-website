import { Button } from "@/components/ui/button"

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (p: number) => void
}) {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="my-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        السابق
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={page === i + 1 ? "default" : "outline"}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        التالي
      </Button>
    </div>
  )
}
