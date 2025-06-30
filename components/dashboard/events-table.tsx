"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  Calendar,
  FileText,
  Search,
  Edit,
  Trash2,
  ArrowUpDown,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Image from "next/image"
import { EditEventDialog } from "@/components/dashboard/edit-event-dialog"
import { deleteEvent } from "@/actions/event.actions"
import { useRouter } from "next/navigation"

// Event type based on your Prisma model
interface Event {
  id: string
  date: Date
  title: string
  description: string
  image: string | null
  link: string
  hour: string
  createdAt: Date
  updatedAt: Date
}

const getStatusBadge = (eventDate: Date) => {
  const now = new Date()
  const eventDateTime = new Date(eventDate)

  if (eventDateTime < now) {
    return (
      <Badge className="border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 shadow-sm">
        <Clock className="mr-1 h-3 w-3" />
        منتهي
      </Badge>
    )
  } else {
    return (
      <Badge className="border-green-200 bg-green-50 text-xs font-medium text-green-700 shadow-sm">
        <Calendar className="mr-1 h-3 w-3" />
        قادم
      </Badge>
    )
  }
}

const getDaysUntil = (eventDate: Date) => {
  const days = Math.ceil(
    (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  return days
}

const getPriorityBadge = (daysUntil: number) => {
  if (daysUntil < 0) {
    return null // Event has passed
  } else if (daysUntil <= 1) {
    return (
      <Badge className="border-red-200 bg-red-50 text-xs font-medium text-red-700">
        <AlertTriangle className="mr-1 h-3 w-3" />
        عاجل
      </Badge>
    )
  } else if (daysUntil <= 7) {
    return (
      <Badge className="border-orange-200 bg-orange-50 text-xs font-medium text-orange-700">
        <Clock className="mr-1 h-3 w-3" />
        قريب
      </Badge>
    )
  }
  return null
}

const columns: ColumnDef<Event>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="تحديد الكل"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="تحديد الصف"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="flex justify-start pr-20">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
        >
          الحدث
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const event = row.original
      const daysUntil = getDaysUntil(event.date)

      return (
        <div className="flex justify-start pr-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="line-clamp-1 max-w-xs truncate font-semibold text-slate-900">
                {event.title}
              </div>
              <div className="max-w-xs truncate text-sm text-slate-500">
                {event.description}
              </div>
            </div>
          </div>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
        >
          التاريخ والوقت
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const event = row.original
      const eventDate = new Date(event.date)

      return (
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-sm">
            <div className="font-medium text-slate-900">
              {eventDate.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="text-slate-500">{event.hour}</div>
          </div>
        </div>
      )
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: () => <div className="flex justify-center">الحالة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {getStatusBadge(row.original.date)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "priority",
    header: () => <div className="flex justify-center">الأولوية</div>,
    cell: ({ row }) => {
      const daysUntil = getDaysUntil(row.original.date)
      const priorityBadge = getPriorityBadge(daysUntil)

      return (
        <div className="flex justify-center">
          {priorityBadge || (
            <span className="text-sm text-slate-500">
              {daysUntil < 0 ? "منتهي" : `${daysUntil} أيام`}
            </span>
          )}
        </div>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const event = row.original
      const [isDialogOpen, setIsDialogOpen] = React.useState(false)
      const [isDeleting, setIsDeleting] = React.useState(false)
      const router = useRouter()

      const handleDelete = async () => {
        setIsDeleting(true)
        try {
          const response = await deleteEvent(event.id)
          if (response.status === 200) {
            toast.success("✅ تم حذف الحدث بنجاح")
            setIsDialogOpen(false) // Fermer le dialog de détails
            router.refresh()
          } else {
            toast.error("❌ فشل في حذف الحدث")
          }
        } catch (error) {
          toast.error("❌ حدث خطأ")
        } finally {
          setIsDeleting(false)
        }
      }

      return (
        <div className="flex items-center gap-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-slate-600 transition-all duration-200 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700"
              >
                <FileText className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">عرض</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] max-w-4xl overflow-y-auto"
              dir="rtl"
            >
              <DialogHeader className="space-y-4 border-b pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      تفاصيل الحدث
                    </DialogTitle>
                    <div className="mt-3 flex items-center gap-2">
                      {getStatusBadge(event.date)}
                      {getPriorityBadge(getDaysUntil(event.date))}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-6">
                {/* Event Info Card */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    معلومات الحدث
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-600">
                        عنوان الحدث
                      </Label>
                      <p className="text-base font-semibold text-slate-900">
                        {event.title}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-600">
                        التاريخ والوقت
                      </Label>
                      <p className="text-base font-semibold text-slate-900">
                        {new Date(event.date).toLocaleDateString("fr-FR")} -{" "}
                        {event.hour}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-green-100 p-2">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    وصف الحدث
                  </h3>
                  <p className="rounded-lg border border-slate-200 bg-white p-4 text-base leading-relaxed whitespace-pre-wrap text-slate-700 shadow-sm">
                    {event.description}
                  </p>
                </div>

                {/* Image and Link Card */}
                <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <ExternalLink className="h-5 w-5 text-purple-600" />
                    </div>
                    الوسائط والروابط
                  </h3>
                  <div className="space-y-4">
                    {event.image && (
                      <div>
                        <Label className="text-sm font-semibold text-slate-600">
                          صورة الحدث
                        </Label>
                        <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                          <Image
                            src={event.image}
                            alt={event.title}
                            width={400}
                            height={200}
                            className="h-48 w-full rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">
                        رابط الحدث
                      </Label>
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 font-mono text-base break-all text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        {event.link}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col gap-3 border-t pt-6 sm:flex-row">
                <EditEventDialog
                  event={event}
                  onSuccess={() => setIsDialogOpen(false)} // Fermer le dialog parent
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:from-blue-100 hover:to-blue-200 hover:shadow-md sm:w-auto"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      تعديل الحدث
                    </Button>
                  }
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:from-red-100 hover:to-red-200 hover:shadow-md sm:w-auto"
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      حذف الحدث
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md" dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-xl">
                        <div className="rounded-full bg-red-100 p-2">
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        حذف الحدث
                      </AlertDialogTitle>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                          <p className="mb-3 text-sm font-semibold text-red-900">
                            هل أنت متأكد من حذف هذا الحدث؟
                          </p>
                          <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                            <li>سيتم حذف الحدث نهائياً</li>
                            <li>لا يمكن التراجع عن هذا الإجراء</li>
                          </ul>
                        </div>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:cursor-pointer">
                        إلغاء
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:cursor-pointer hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            جاري الحذف...
                          </div>
                        ) : (
                          "حذف الحدث"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
    size: 100,
  },
]

interface EventsTableProps {
  data: Event[]
}

export function EventsTable({ data }: EventsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Global search state
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const title = row.original.title.toLowerCase()
      const description = row.original.description.toLowerCase()

      return title.includes(searchValue) || description.includes(searchValue)
    },
  })

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white shadow-sm"
      dir="rtl"
    >
      {/* Simplified Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="البحث في الأحداث..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-80 border-slate-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {globalFilter && (
            <Badge variant="secondary" className="text-xs">
              {table.getFilteredRowModel().rows.length} نتيجة
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-300">
                <Settings className="ml-2 h-4 w-4" />
                عرض
                <ChevronDown className="mr-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "title" && "الحدث"}
                    {column.id === "date" && "التاريخ والوقت"}
                    {column.id === "status" && "الحالة"}
                    {column.id === "priority" && "الأولوية"}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 font-semibold text-slate-700"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-100 hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-4"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Calendar className="h-8 w-8" />
                    <p>لا توجد أحداث</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <div className="text-sm text-slate-600">
          {table.getFilteredSelectedRowModel().rows.length} من{" "}
          {table.getFilteredRowModel().rows.length} محدد
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">صفوف لكل صفحة</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-slate-600">
            صفحة {table.getState().pagination.pageIndex + 1} من{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
