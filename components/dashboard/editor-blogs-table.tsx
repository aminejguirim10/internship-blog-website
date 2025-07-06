"use client"

import * as React from "react"
import Image from "next/image"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Settings,
  FileText,
} from "lucide-react"
import type { BlogStatus } from "@prisma/client"

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { deleteBlog } from "@/actions/blog.actions"

// Blog type based
interface Blog {
  id: string
  title: string
  content: string
  status: BlogStatus
  image: string | null
  createdAt: Date
  updatedAt: Date
  authorId: string | null
  author: {
    name: string | null
    image: string | null
  } | null
  tags: Array<{
    id: string
    name: string
  }>
  _count: {
    blogViews: number
  }
}

const getStatusBadge = (status: BlogStatus) => {
  switch (status) {
    case "ACCEPTED":
      return (
        <Badge className="border-green-200 bg-green-50 text-xs font-medium text-green-700 shadow-sm">
          <CheckCircle className="mr-1 h-3 w-3" />
          مقبول
        </Badge>
      )
    case "PENDING":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-xs font-medium text-orange-700 shadow-sm">
          <Clock className="mr-1 h-3 w-3" />
          في الانتظار
        </Badge>
      )
    case "REJECTED":
      return (
        <Badge className="border-red-200 bg-red-50 text-xs font-medium text-red-700 shadow-sm">
          <XCircle className="mr-1 h-3 w-3" />
          مرفوض
        </Badge>
      )
    default:
      return null
  }
}

const getTypeLabel = () => {
  return "محتوى"
}

interface EditorBlogTableProps {
  data: Blog[]
  type: string
  authorName?: string
}

export function EditorBlogTable({
  data,
  type,
  authorName,
}: EditorBlogTableProps) {
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

  const columns: ColumnDef<Blog>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        <div className="flex justify-start pr-12">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
          >
            محتوى
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const blog = row.original

        return (
          <div className="flex justify-start pr-12">
            <div className="flex items-center gap-3">
              <div className="relative">
                {blog.image ? (
                  <Image
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 max-w-xs truncate font-semibold text-slate-900">
                  {blog.title}
                </div>
                <div className="line-clamp-2 max-w-xs truncate text-sm text-slate-500">
                  {blog.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                </div>
              </div>
            </div>
          </div>
        )
      },
      size: 200,
    },
    {
      accessorKey: "status",
      header: () => <div className="flex justify-center">الحالة</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {getStatusBadge(row.original.status)}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "views",
      header: () => <div className="flex justify-center">المشاهدات</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Eye className="h-4 w-4" />
            {row.original._count.blogViews}
          </div>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "tags",
      header: () => <div className="flex justify-center">العلامات</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-1">
            {row.original.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="default" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {row.original.tags.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{row.original.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      ),
      size: 150,
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
            تاريخ النشر
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)

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
        const blog = row.original

        // Individual states for each row
        const [isDeleting, setIsDeleting] = React.useState(false)
        const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

        const handleDelete = async () => {
          setIsDeleting(true)
          try {
            const response = await deleteBlog(blog.id)
            if (response.status === 200) {
              toast.success("✅ تم حذف المحتوى بنجاح")
              setDeleteDialogOpen(false)
            } else {
              toast.error("❌ فشل في حذف المحتوى")
            }
          } catch (error) {
            toast.error("❌ حدث خطأ")
          } finally {
            setIsDeleting(false)
          }
        }

        return (
          <div className="flex items-center gap-1">
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-slate-600 transition-all duration-200 hover:cursor-pointer hover:bg-red-50 hover:text-red-700"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">حذف</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md" dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-xl">
                    <div className="rounded-full bg-red-100 p-2">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    حذف المحتوى
                  </AlertDialogTitle>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                      <p className="mb-3 text-sm font-semibold text-red-900">
                        هل أنت متأكد من حذف "{blog.title}"؟
                      </p>
                      <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                        <li>سيتم حذف المحتوى نهائياً</li>
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
                      "حذف المحتوى"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
      size: 80,
    },
  ]

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
      const content = row.original.content.toLowerCase()

      return title.includes(searchValue) || content.includes(searchValue)
    },
  })

  const typeLabel = getTypeLabel()

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
              placeholder={`البحث في ${typeLabel} الخاصة بي...`}
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
          {authorName && (
            <Badge variant="outline" className="text-xs">
              {authorName}
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
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "title"
                        ? typeLabel
                        : column.id === "author"
                          ? "المؤلف"
                          : column.id === "status"
                            ? "الحالة"
                            : column.id === "views"
                              ? "المشاهدات"
                              : column.id === "tags"
                                ? "العلامات"
                                : column.id === "createdAt"
                                  ? "تاريخ النشر"
                                  : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-slate-200 bg-slate-50/50 font-semibold text-slate-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-200 hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-slate-200 py-3">
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
                    <p>لا يوجد {typeLabel}</p>
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
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
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
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
