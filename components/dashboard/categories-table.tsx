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
  FolderOpen,
  FileText,
  Search,
  Edit,
  Trash2,
  ArrowUpDown,
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditCategoryDialog } from "./edit-category-dialog"
import { deleteCategory } from "@/actions/category.actions"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  blogs: Array<{
    id: string
    status: string
  }>
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const handleDelete = async (categoryId: string, blogCount: number) => {
    if (blogCount > 0) {
      toast.error("لا يمكن حذف الفئة", {
        description: `هذه الفئة تحتوي على ${blogCount} مقالة. يرجى إزالة جميع المقالات أولاً.`,
      })
      return
    }

    setDeletingId(categoryId)

    try {
      const result = await deleteCategory(categoryId)
      if (result.status === 200) {
        toast.success("✅ تم حذف الفئة بنجاح")
      } else {
        toast.error("❌ فشل في حذف الفئة")
      }
    } catch (error) {
      toast.error("❌ حدث خطأ أثناء حذف الفئة")
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex justify-start pr-20">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
          >
            الفئة
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex justify-start pr-20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 max-w-xs truncate font-semibold text-slate-900">
                  {category.name}
                </div>
                <div className="max-w-xs truncate text-sm text-slate-500">
                  تم إنشاؤها في{" "}
                  {new Date(category.createdAt).toLocaleDateString("en-US")}
                </div>
              </div>
            </div>
          </div>
        )
      },
      size: 100,
    },
    {
      accessorKey: "blogs",
      header: () => <div className="flex justify-center">المقالات</div>,
      cell: ({ row }) => {
        const blogCount = row.original.blogs.length
        const publishedCount = row.original.blogs.filter(
          (blog) => blog.status === "ACCEPTED"
        ).length
        const pendingCount = row.original.blogs.filter(
          (blog) => blog.status === "PENDING"
        ).length

        return (
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="font-medium">{blogCount}</span>
              </div>
              {blogCount > 0 && (
                <div className="flex gap-1">
                  {publishedCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-xs text-green-700"
                    >
                      {publishedCount} منشورة
                    </Badge>
                  )}
                  {pendingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-xs text-yellow-700"
                    >
                      {pendingCount} معلقة
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      },
      size: 150,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold text-slate-700 hover:cursor-pointer hover:bg-transparent hover:text-slate-900"
          >
            آخر تحديث
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"))
        return (
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-sm">
              <div className="font-medium text-slate-900">
                {date.toLocaleDateString("en-US")}
              </div>
              <div className="text-slate-500">
                {date.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
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
        const category = row.original
        const blogCount = category.blogs.length
        const [isDialogOpen, setIsDialogOpen] = React.useState(false)
        const isDeleting = deletingId === category.id

        const handleDeleteWithClose = async () => {
          await handleDelete(category.id, blogCount)
          if (deletingId !== category.id) {
            setIsDialogOpen(false)
          }
        }

        return (
          <div className="flex items-center justify-center gap-1">
            <EditCategoryDialog
              category={category}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-slate-600 transition-all duration-200 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  disabled={deletingId === category.id}
                >
                  <Edit className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">تعديل</span>
                </Button>
              }
            />
            {blogCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-not-allowed px-3 text-orange-500"
                disabled={true}
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">محظور</span>
              </Button>
            ) : (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-red-600 transition-all duration-200 hover:cursor-pointer hover:bg-red-50 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-600"></div>
                        <span className="ml-2 hidden sm:inline">
                          جاري الحذف...
                        </span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">حذف</span>
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md" dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-xl">
                      <div className="rounded-full bg-red-100 p-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </div>
                      حذف الفئة
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="space-y-4">
                        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                          <div className="mb-3 text-sm font-semibold text-red-900">
                            هل أنت متأكد من حذف الفئة "{category.name}"؟
                          </div>
                          <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                            <li>سيتم حذف الفئة نهائياً</li>
                            <li>لا يمكن التراجع عن هذا الإجراء</li>
                          </ul>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      className="hover:cursor-pointer"
                      disabled={isDeleting}
                    >
                      إلغاء
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteWithClose}
                      className="bg-red-600 hover:cursor-pointer hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          جاري الحذف...
                        </div>
                      ) : (
                        "حذف الفئة"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )
      },
      enableSorting: false,
      size: 100,
    },
  ]

  const table = useReactTable({
    data: categories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const name = row.original.name.toLowerCase()

      return name.includes(searchValue)
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
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
              placeholder="البحث في الفئات..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-80 border-slate-300 pr-10 focus:border-emerald-500 focus:ring-emerald-500"
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
                    {column.id === "name" && "الفئة"}
                    {column.id === "blogs" && "المقالات"}
                    {column.id === "updatedAt" && "آخر تحديث"}
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
                    <FolderOpen className="h-8 w-8" />
                    <p>لا توجد فئات</p>
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
