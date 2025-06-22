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
  User,
  Calendar,
  FileText,
  Search,
  Check,
  X,
  ArrowUpDown,
  Clock,
  AlertTriangle,
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
import { responseApplication } from "@/actions/application.actions"
import { toast } from "sonner"

// Application type based on your Prisma model
interface Application {
  id: string
  name: string
  email: string
  subject: string
  bio: string
  exemple: string
  createdAt: Date
  updatedAt: Date
}

const getStatusBadge = () => {
  return (
    <Badge className="border-amber-200 bg-amber-50 text-xs font-medium text-amber-700 shadow-sm">
      <Clock className="mr-1 h-3 w-3" />
      قيد المراجعة
    </Badge>
  )
}

const getDaysOld = (createdAt: Date) => {
  const days = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  return days
}

const getPriorityBadge = (daysOld: number) => {
  if (daysOld > 14) {
    return (
      <Badge className="border-red-200 bg-red-50 text-xs font-medium text-red-700">
        <AlertTriangle className="mr-1 h-3 w-3" />
        عاجل
      </Badge>
    )
  } else if (daysOld > 7) {
    return (
      <Badge className="border-orange-200 bg-orange-50 text-xs font-medium text-orange-700">
        <Clock className="mr-1 h-3 w-3" />
        أولوية عالية
      </Badge>
    )
  }
  return null
}

const columns: ColumnDef<Application>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex justify-start pr-12">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
        >
          المتقدم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const application = row.original
      const daysOld = getDaysOld(application.createdAt)

      return (
        <div className="flex justify-start pr-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-sm">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900">
                {application.name}
              </div>
              <div className="text-sm text-slate-500">{application.email}</div>
            </div>
          </div>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
        >
          الموضوع
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="max-w-xs">
          <div
            className="truncate font-medium text-slate-900"
            title={row.original.subject}
          >
            {row.original.subject}
          </div>
          <div className="mt-1 truncate text-sm text-slate-500">
            {row.original.bio.substring(0, 50)}...
          </div>
        </div>
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: "status",
    header: () => <div className="flex justify-center">الحالة</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">{getStatusBadge()}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
        >
          تاريخ التقديم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const daysOld = getDaysOld(row.original.createdAt)

      return (
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-sm">
            <div className="font-medium text-slate-900">
              {date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="text-slate-500">
              {daysOld === 0
                ? "اليوم"
                : `منذ ${daysOld} ${daysOld === 1 ? "يوم" : "أيام"}`}
            </div>
          </div>
        </div>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const application = row.original
      const [isProcessing, setIsProcessing] = React.useState(false)
      const [isDialogOpen, setIsDialogOpen] = React.useState(false)

      const handleResponse = async (response: "ACCEPTED" | "REJECTED") => {
        setIsProcessing(true)
        try {
          const result = await responseApplication(application.id, response)
          if (result.status === 200) {
            toast.success("✅ تم معالجة الطلب بنجاح")
            setIsDialogOpen(false)
          } else {
            toast.error("❌ فشل في معالجة الطلب")
          }
        } catch (error) {
          toast.error("❌ حدث خطأ")
        } finally {
          setIsProcessing(false)
        }
      }

      const daysOld = getDaysOld(application.createdAt)
      const isUrgent = daysOld > 7

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
                <span className="ml-2 hidden sm:inline">مراجعة</span>
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] max-w-4xl overflow-y-auto"
              dir="rtl"
            >
              <DialogHeader className="space-y-4 border-b pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-lg">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      مراجعة الطلب
                    </DialogTitle>
                    <div className="mt-3 flex items-center gap-2">
                      {getStatusBadge()}
                      {isUrgent && (
                        <Badge className="border-red-200 bg-red-50 text-xs text-red-700">
                          🔥 منذ {daysOld} {daysOld === 1 ? "يوم" : "أيام"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-6">
                {/* Personal Info Card */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    المعلومات الشخصية
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-600">
                        الاسم الكامل
                      </Label>
                      <p className="text-base font-semibold text-slate-900">
                        {application.name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-600">
                        البريد الإلكتروني
                      </Label>
                      <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-base font-semibold break-all text-slate-900">
                        {application.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Application Details Card */}
                <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-green-100 p-2">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    تفاصيل الطلب
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">
                        الموضوع
                      </Label>
                      <p className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-base font-medium text-slate-900 shadow-sm">
                        {application.subject}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">
                        السيرة الذاتية والخبرة
                      </Label>
                      <p className="mt-2 rounded-lg border border-slate-200 bg-white p-4 text-base leading-relaxed whitespace-pre-wrap text-slate-700 shadow-sm">
                        {application.bio}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">
                        معرض الأعمال/أمثلة العمل
                      </Label>
                      <p className="mt-2 rounded-lg border border-slate-200 bg-white p-4 font-mono text-base break-all text-slate-700 shadow-sm">
                        {application.exemple}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    الجدول الزمني والحالة
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-600">
                        تاريخ التقديم
                      </Label>
                      <p className="text-base font-semibold text-slate-900">
                        {new Date(application.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col gap-3 border-t pt-6 sm:flex-row">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:from-red-100 hover:to-red-200 hover:shadow-md sm:w-auto"
                      disabled={isProcessing}
                    >
                      <X className="mr-2 h-4 w-4" />
                      رفض الطلب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md" dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-xl">
                        <div className="rounded-full bg-red-100 p-2">
                          <X className="h-5 w-5 text-red-600" />
                        </div>
                        رفض الطلب
                      </AlertDialogTitle>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                          <p className="mb-3 text-sm font-semibold text-red-900">
                            سيؤدي هذا الإجراء إلى:
                          </p>
                          <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                            <li>
                              إرسال بريد إلكتروني برفض الطلب إلى{" "}
                              {application.email}
                            </li>
                            <li>إزالة الطلب من النظام</li>
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
                        onClick={() => handleResponse("REJECTED")}
                        className="bg-red-600 hover:cursor-pointer hover:bg-red-700"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            جاري المعالجة...
                          </div>
                        ) : (
                          "رفض الطلب"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full hover:cursor-pointer sm:w-auto"
                      disabled={isProcessing}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      قبول الطلب
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md" dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-xl">
                        <div className="rounded-full bg-green-100 p-2">
                          <Check className="text-primary/60 h-5 w-5" />
                        </div>
                        قبول الطلب
                      </AlertDialogTitle>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                          <p className="mb-3 text-sm font-semibold text-green-900">
                            سيؤدي هذا الإجراء إلى:
                          </p>
                          <ul className="list-inside list-disc space-y-2 text-sm text-green-700">
                            <li>
                              إرسال بريد إلكتروني بقبول الطلب إلى{" "}
                              {application.email}
                            </li>
                            <li>إزالة الطلب من قائمة الانتظار</li>
                            <li>الترحيب بهم في الفريق! 🎉</li>
                          </ul>
                        </div>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:cursor-pointer">
                        إلغاء
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleResponse("ACCEPTED")}
                        disabled={isProcessing}
                        className="hover:cursor-pointer"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            جاري المعالجة...
                          </div>
                        ) : (
                          "قبول الطلب"
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

interface ApplicationsTableProps {
  data: Application[]
}

export function ApplicationsTable({ data }: ApplicationsTableProps) {
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
      const name = row.original.name.toLowerCase()
      const email = row.original.email.toLowerCase()
      const subject = row.original.subject.toLowerCase()

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        subject.includes(searchValue)
      )
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
              placeholder="البحث في الطلبات..."
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
                    {column.id === "name" && "المتقدم"}
                    {column.id === "subject" && "الموضوع"}
                    {column.id === "status" && "الحالة"}
                    {column.id === "createdAt" && "تاريخ التقديم"}
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
                    <FileText className="h-8 w-8" />
                    <p>لا توجد طلبات</p>
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
