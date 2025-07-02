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
  Search,
  Trash2,
  ArrowUpDown,
  Shield,
  Crown,
  Users,
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Image from "next/image"
import { deleteUser } from "@/actions/user.actions"
import { useRouter } from "next/navigation"

// User type based
interface PrismaUser {
  id: string
  clerkId: string
  email: string
  name: string | null
  image: string | null
  role: "USER" | "EDITOR" | "ADMIN"
  phoneNumber: string | null
  dateNaissance: string | null
  createdAt: Date
  updatedAt: Date
}

const getRoleBadge = (role: "USER" | "EDITOR" | "ADMIN") => {
  switch (role) {
    case "ADMIN":
      return (
        <Badge className="border-red-200 bg-red-50 text-xs font-medium text-red-700 shadow-sm">
          <Crown className="mr-1 h-3 w-3" />
          مدير
        </Badge>
      )
    case "EDITOR":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-xs font-medium text-blue-700 shadow-sm">
          <Shield className="mr-1 h-3 w-3" />
          محرر
        </Badge>
      )
    case "USER":
    default:
      return (
        <Badge className="border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 shadow-sm">
          <Users className="mr-1 h-3 w-3" />
          مستخدم
        </Badge>
      )
  }
}

const columns: ColumnDef<PrismaUser>[] = [
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
          المستخدم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex justify-start pr-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-sm">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900">
                {user.name || "بدون اسم"}
              </div>
              <div className="text-sm text-slate-500">{user.email}</div>
            </div>
          </div>
        </div>
      )
    },
    size: 300,
  },
  {
    accessorKey: "role",
    header: () => <div className="flex justify-center">الدور</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {getRoleBadge(row.original.role)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="flex justify-center">رقم الهاتف</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="text-sm text-slate-700">
          {row.original.phoneNumber || "غير محدد"}
        </span>
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
          تاريخ التسجيل
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
      const user = row.original
      const [isDeleting, setIsDeleting] = React.useState(false)
      const router = useRouter()

      const handleDelete = async () => {
        setIsDeleting(true)
        try {
          const response = await deleteUser(user.id)
          if (response.status === 200) {
            toast.success("✅ تم حذف المستخدم بنجاح")
            router.refresh()
          } else {
            toast.error("❌ فشل في حذف المستخدم")
          }
        } catch (error) {
          toast.error("❌ حدث خطأ")
        } finally {
          setIsDeleting(false)
        }
      }

      // Ne pas permettre la suppression des admins
      const canDelete = user.role !== "ADMIN"

      return (
        <div className="flex items-center gap-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-slate-600 transition-all duration-200 hover:cursor-pointer hover:bg-red-50 hover:text-red-700"
                disabled={!canDelete || isDeleting}
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
                  حذف المستخدم
                </AlertDialogTitle>
                <div className="space-y-4">
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-red-900">
                      هل أنت متأكد من حذف المستخدم "{user.name || user.email}"؟
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                      <li>سيتم حذف المستخدم نهائياً</li>
                      <li>سيتم حذف جميع بياناته</li>
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
                    "حذف المستخدم"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
    size: 100,
  },
]

interface UsersTableProps {
  data: PrismaUser[]
}

export function UsersTable({ data }: UsersTableProps) {
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
      const name = (row.original.name || "").toLowerCase()
      const email = row.original.email.toLowerCase()

      return name.includes(searchValue) || email.includes(searchValue)
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
              placeholder="البحث في المستخدمين..."
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
                    {column.id === "name" && "المستخدم"}
                    {column.id === "role" && "الدور"}
                    {column.id === "phoneNumber" && "رقم الهاتف"}
                    {column.id === "createdAt" && "تاريخ التسجيل"}
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
                    <User className="h-8 w-8" />
                    <p>لا يوجد مستخدمون</p>
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
