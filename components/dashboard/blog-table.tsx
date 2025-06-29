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
  FileText,
  Search,
  Trash2,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Hash,
  ImageIcon,
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
import { deleteBlog, responseBlog } from "@/actions/blog.actions"
import { useRouter } from "next/navigation"
import type { BlogType, BlogStatus } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Blog type based on your Prisma model
interface Blog {
  id: string
  title: string
  content: string
  type: BlogType
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

const getTypeLabel = (type: BlogType) => {
  switch (type) {
    case "ARTICLE":
      return "مقال"
    case "RAPPORT":
      return "تقرير"
    case "RECHERCHE":
      return "بحث"
    default:
      return "محتوى"
  }
}

interface BlogTableProps {
  data: Blog[]
  type: BlogType
}

export function BlogTable({ data, type }: BlogTableProps) {
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
  const router = useRouter()

  // Remove global dialog states as they will be managed per row

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
            {getTypeLabel(type)}
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 font-semibold text-slate-900">
                  {blog.title}
                </div>
                <div className="line-clamp-2 max-w-xs truncate text-sm text-slate-500">
                  {blog.content.replace(/<[^>]*>/g, "").substring(0, 30)}{" "}
                </div>
              </div>
            </div>
          </div>
        )
      },
      size: 200,
    },
    {
      accessorKey: "author",
      header: () => <div className="flex justify-center">المؤلف</div>,
      cell: ({ row }) => {
        const blog = row.original

        return (
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {blog.author?.image ? (
                <Image
                  src={blog.author.image || "/placeholder.svg"}
                  alt={blog.author.name || "Author"}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
              <span className="text-sm text-slate-700">
                {blog.author?.name || "غير محدد"}
              </span>
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
        const [isResponding, setIsResponding] = React.useState(false)
        const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
        const [acceptDialogOpen, setAcceptDialogOpen] = React.useState(false)
        const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
        const [reviewDialogOpen, setReviewDialogOpen] = React.useState(false)

        const handleDelete = async () => {
          setIsDeleting(true)
          try {
            const response = await deleteBlog(blog.id)
            if (response.status === 200) {
              toast.success("✅ تم حذف المحتوى بنجاح")
              setDeleteDialogOpen(false)
              router.refresh()
            } else {
              toast.error("❌ فشل في حذف المحتوى" + response.message)
            }
          } catch (error) {
            toast.error("❌ حدث خطأ")
          } finally {
            setIsDeleting(false)
          }
        }

        const handleResponse = async (response: "ACCEPTED" | "REJECTED") => {
          setIsResponding(true)
          try {
            const result = await responseBlog(blog.id, response)
            if (result.status === 200) {
              toast.success(
                response === "ACCEPTED"
                  ? "✅ تم قبول المحتوى"
                  : "✅ تم رفض المحتوى"
              )
              if (response === "ACCEPTED") {
                setAcceptDialogOpen(false)
              } else {
                setRejectDialogOpen(false)
              }
              // Close the main review dialog
              setReviewDialogOpen(false)
              router.refresh()
            } else {
              toast.error("❌ فشل في تحديث حالة المحتوى")
            }
          } catch (error) {
            toast.error("❌ حدث خطأ")
          } finally {
            setIsResponding(false)
          }
        }

        // Show different buttons based on status
        if (blog.status === "ACCEPTED") {
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
        }

        // Show verification button for pending blogs
        if (blog.status === "PENDING") {
          return (
            <div className="flex items-center gap-1">
              <Dialog
                open={reviewDialogOpen}
                onOpenChange={setReviewDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-blue-600 transition-all duration-200 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">تحقق</span>
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="max-h-[90vh] max-w-4xl overflow-y-auto"
                  dir="rtl"
                >
                  <DialogHeader className="space-y-4 border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] text-white shadow-lg">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-2xl font-bold text-slate-900">
                          مراجعة المحتوى
                        </DialogTitle>
                        <div className="mt-3 flex items-center gap-2">
                          {getStatusBadge(blog.status)}
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(blog.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="grid gap-6 py-6">
                    {/* Blog Info Card */}
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        معلومات المحتوى
                      </h3>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-600">
                            العنوان
                          </Label>
                          <p className="text-base font-semibold text-slate-900">
                            {blog.title}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-600">
                            المؤلف
                          </Label>
                          <div className="flex items-center gap-2">
                            {blog.author?.image ? (
                              <Image
                                src={blog.author.image || "/placeholder.svg"}
                                alt={blog.author.name || "Author"}
                                width={24}
                                height={24}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                                <User className="h-3 w-3 text-gray-500" />
                              </div>
                            )}
                            <span className="text-base font-semibold text-slate-900">
                              {blog.author?.name || "غير محدد"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-600">
                            تاريخ الإنشاء
                          </Label>
                          <p className="text-base font-semibold text-slate-900">
                            {new Date(blog.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-600">
                            عدد المشاهدات
                          </Label>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-slate-500" />
                            <span className="text-base font-semibold text-slate-900">
                              {blog._count.blogViews}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Card */}
                    {blog.image && (
                      <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50 p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                          <div className="rounded-lg bg-green-100 p-2">
                            <ImageIcon className="h-5 w-5 text-green-600" />
                          </div>
                          صورة المحتوى
                        </h3>
                        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                          <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            width={400}
                            height={200}
                            className="h-48 w-full rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content Card */}
                    <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                        <div className="rounded-lg bg-orange-100 p-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        محتوى {getTypeLabel(blog.type)}
                      </h3>
                      <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div
                          className="prose prose-slate max-w-none text-base leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      </div>
                    </div>
                    {/* Tags Card */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                          <div className="rounded-lg bg-purple-100 p-2">
                            <Hash className="h-5 w-5 text-purple-600" />
                          </div>
                          العلامات
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="text-sm"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="flex-col gap-3 border-t pt-6 sm:flex-row">
                    <AlertDialog
                      open={acceptDialogOpen}
                      onOpenChange={setAcceptDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full hover:cursor-pointer sm:w-auto"
                          disabled={isResponding}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          قبول المحتوى
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md" dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-full bg-green-100 p-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            قبول المحتوى
                          </AlertDialogTitle>
                          <div className="space-y-4">
                            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                              <p className="mb-3 text-sm font-semibold text-green-900">
                                هل أنت متأكد من قبول "{blog.title}"؟
                              </p>
                              <ul className="list-inside list-disc space-y-2 text-sm text-green-700">
                                <li>سيتم نشر المحتوى للجمهور</li>
                                <li>سيصبح متاحاً للقراءة والمشاهدة</li>
                                <li>سيتم إشعار المؤلف بالقبول</li>
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
                            className="hover:cursor-pointer"
                            disabled={isResponding}
                          >
                            {isResponding ? (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                جاري القبول...
                              </div>
                            ) : (
                              "قبول المحتوى"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      open={rejectDialogOpen}
                      onOpenChange={setRejectDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700 transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer hover:from-red-100 hover:to-red-200 hover:shadow-md sm:w-auto"
                          disabled={isResponding}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          رفض المحتوى
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md" dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-full bg-red-100 p-2">
                              <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            رفض المحتوى
                          </AlertDialogTitle>
                          <div className="space-y-4">
                            <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                              <p className="mb-3 text-sm font-semibold text-red-900">
                                هل أنت متأكد من رفض "{blog.title}"؟
                              </p>
                              <ul className="list-inside list-disc space-y-2 text-sm text-red-700">
                                <li>سيتم حذف المحتوى نهائياً</li>
                                <li>لن يكون متاحاً للنشر</li>
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
                            disabled={isResponding}
                          >
                            {isResponding ? (
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                جاري الرفض...
                              </div>
                            ) : (
                              "رفض المحتوى"
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
        }

        return null
      },
      size: 150,
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

  const typeLabel = getTypeLabel(type)

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
              placeholder={`البحث في ${typeLabel}...`}
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
                    {column.id === "title" && typeLabel}
                    {column.id === "author" && "المؤلف"}
                    {column.id === "status" && "الحالة"}
                    {column.id === "views" && "المشاهدات"}
                    {column.id === "createdAt" && "تاريخ النشر"}
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
