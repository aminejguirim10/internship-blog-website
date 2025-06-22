import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Card
          className="rounded-lg border border-slate-200 bg-white shadow-sm"
          dir="rtl"
        >
          {/* Toolbar skeleton */}
          <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-80 bg-slate-200" />
              <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20 bg-slate-200" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="h-12 w-12">
                    <Skeleton className="h-4 w-4 bg-slate-200" />
                  </TableHead>
                  <TableHead className="h-12">
                    <Skeleton className="mx-auto h-4 w-24 bg-slate-200" />
                  </TableHead>
                  <TableHead className="h-12">
                    <Skeleton className="mx-auto h-4 w-16 bg-slate-200" />
                  </TableHead>
                  <TableHead className="h-12">
                    <Skeleton className="mx-auto h-4 w-20 bg-slate-200" />
                  </TableHead>
                  <TableHead className="h-12">
                    <Skeleton className="mx-auto h-4 w-18 bg-slate-200" />
                  </TableHead>
                  <TableHead className="h-12 w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index} className="border-slate-100">
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-4 bg-slate-200" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3 pr-12">
                        <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-slate-300" />
                          <Skeleton className="h-3 w-48 bg-slate-200" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Skeleton className="h-4 w-12 bg-slate-200" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16 bg-slate-200" />
                          <Skeleton className="h-3 w-12 bg-slate-100" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-16 bg-slate-200" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <Skeleton className="h-4 w-24 bg-slate-200" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20 bg-slate-200" />
                <Skeleton className="h-8 w-16 bg-slate-200" />
              </div>
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 bg-slate-200" />
                <Skeleton className="h-8 w-8 bg-slate-200" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
