"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Send,
  Trash2,
  Loader2,
  Edit3,
  Save,
  X,
  Clock,
  User,
  Smile,
} from "lucide-react"
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/actions/comment.actions"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import { getFallback } from "@/lib/utils"
import Link from "next/link"
import EmojiPicker, { Categories, EmojiClickData } from "emoji-picker-react"

interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
    clerkId: string | null
  }
}

interface LoadMoreCommentsProps {
  blogId: string
  pageSize?: number
}

const MAX_COMMENT_LENGTH = 1000
const ITEMS_PER_PAGE = 10

export function LoadMoreComments({
  blogId,
  pageSize = ITEMS_PER_PAGE,
}: LoadMoreCommentsProps) {
  const { user, isLoaded } = useUser()

  // Core state
  const [comments, setComments] = useState<Comment[]>([])
  const [totalComments, setTotalComments] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [hasComments, setHasComments] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Comment creation state
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Delete state
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  )
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false)
  const newCommentRef = useRef<HTMLTextAreaElement>(null)
  const editCommentRef = useRef<HTMLTextAreaElement>(null)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })

  // Load more comments
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/comments?blogId=${blogId}&page=${page}&pageSize=${pageSize}`
      )
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (
        !data?.comments ||
        !Array.isArray(data.comments) ||
        data.comments.length === 0
      ) {
        setHasMore(false)
        if (comments.length === 0) setHasComments(false)
        if (data?.totalCount !== undefined) setTotalComments(data.totalCount)
        return
      }
      setComments((prev) => [...prev, ...data.comments])
      setPage((prev) => prev + 1)
      setHasMore(data.hasMore)
      if (data?.totalCount !== undefined) setTotalComments(data.totalCount)
    } catch (error) {
      setHasMore(false)
      if (comments.length === 0) setHasComments(false)
      toast.error("حدث خطأ أثناء جلب التعليقات")
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, blogId, page, pageSize, comments.length])

  useEffect(() => {
    if (inView && hasMore && !isLoading) loadMore()
  }, [inView, hasMore, isLoading, loadMore])

  // Handle emoji selection
  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData, isEdit: boolean) => {
      const emoji = emojiData.emoji
      if (isEdit) {
        setEditContent((prev) => prev + emoji)
        if (editCommentRef.current) {
          editCommentRef.current.focus()
        }
      } else {
        setNewComment((prev) => prev + emoji)
        if (newCommentRef.current) {
          newCommentRef.current.focus()
        }
      }
      setShowEmojiPicker(false)
      setShowEditEmojiPicker(false)
    },
    []
  )

  // Comment submission
  const handleSubmitComment = useCallback(async () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة تعليق")
      return
    }
    const trimmedComment = newComment.trim()
    if (!trimmedComment) {
      toast.error("يرجى كتابة تعليق")
      return
    }
    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      toast.error(`التعليق يجب أن يكون أقل من ${MAX_COMMENT_LENGTH} حرف`)
      return
    }
    setIsSubmitting(true)
    try {
      const result = await createComment(blogId, trimmedComment)
      if (result.success && result.data) {
        toast.success("تم إضافة التعليق بنجاح")
        setNewComment("")
        const newCommentData = {
          id: result.data.id,
          content: result.data.content,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
          author: {
            id: result.data.author.id,
            name: result.data.author.name,
            image: result.data.author.image,
            clerkId: result.data.author.clerkId,
          },
        }
        setComments((prev) => [newCommentData, ...prev])
        setTotalComments((prev) => prev + 1)
        if (!hasComments) setHasComments(true)
      } else {
        toast.error(result.message || "حدث خطأ أثناء إضافة التعليق")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التعليق")
    } finally {
      setIsSubmitting(false)
    }
  }, [user, newComment, blogId, hasComments])

  // Edit comment handlers
  const handleEditComment = useCallback((comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null)
    setEditContent("")
    setShowEditEmojiPicker(false)
  }, [])

  const handleUpdateComment = useCallback(
    async (commentId: string) => {
      const trimmedContent = editContent.trim()
      if (!trimmedContent) {
        toast.error("يرجى كتابة محتوى التعليق")
        return
      }
      if (trimmedContent.length > MAX_COMMENT_LENGTH) {
        toast.error(`التعليق يجب أن يكون أقل من ${MAX_COMMENT_LENGTH} حرف`)
        return
      }
      setIsUpdating(true)
      try {
        const result = await updateComment(commentId, trimmedContent)
        if (result.success) {
          toast.success("تم تعديل التعليق بنجاح")
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? { ...comment, content: trimmedContent, updatedAt: new Date() }
                : comment
            )
          )
          handleCancelEdit()
        } else {
          toast.error(result.message || "حدث خطأ أثناء تعديل التعليق")
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تعديل التعليق")
      } finally {
        setIsUpdating(false)
      }
    },
    [editContent, handleCancelEdit]
  )

  // Delete comment handlers
  const handleDeleteComment = useCallback(async (commentId: string) => {
    setDeletingCommentId(commentId)
    setShowDeleteDialog(true)
  }, [])

  const confirmDeleteComment = useCallback(async () => {
    if (!deletingCommentId) return
    try {
      const result = await deleteComment(deletingCommentId)
      if (result.success) {
        toast.success("تم حذف التعليق بنجاح")
        setComments((prev) =>
          prev.filter((comment) => comment.id !== deletingCommentId)
        )
        setTotalComments((prev) => Math.max(0, prev - 1))
      } else {
        toast.error(result.message || "حدث خطأ أثناء حذف التعليق")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف التعليق")
    } finally {
      setDeletingCommentId(null)
      setShowDeleteDialog(false)
    }
  }, [deletingCommentId])

  const cancelDeleteComment = useCallback(() => {
    setDeletingCommentId(null)
    setShowDeleteDialog(false)
  }, [])

  const isCommentEdited = useCallback((comment: Comment) => {
    return (
      new Date(comment.updatedAt).getTime() >
      new Date(comment.createdAt).getTime()
    )
  }, [])

  const isCommentOwner = useCallback(
    (comment: Comment) => {
      return user?.id === comment.author.clerkId
    },
    [user?.id]
  )

  const getCharacterCount = useCallback((text: string) => {
    const length = text.length
    const isOverLimit = length > MAX_COMMENT_LENGTH
    return {
      length,
      isOverLimit,
      remaining: MAX_COMMENT_LENGTH - length,
    }
  }, [])

  const getUserCommentsCount = useCallback(() => {
    if (!user) return 0
    return comments.filter((comment) => comment.author.id === user.id).length
  }, [comments, user])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">جاري تحميل التعليقات...</p>
        </div>
      </div>
    )
  }

  const newCommentStats = getCharacterCount(newComment)
  const editCommentStats = getCharacterCount(editContent)

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">
              منطقة التعليقات
            </h3>
            <p className="text-slate-600">شارك أفكارك وتفاعل مع المجتمع</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1.5 backdrop-blur-sm">
              <User className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {totalComments} تعليق
                {totalComments > 0 && comments.length < totalComments && (
                  <span className="mr-1 text-xs text-slate-500">
                    ({comments.length} محمّل)
                  </span>
                )}
              </span>
            </div>
            {user && getUserCommentsCount() > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-100/60 px-3 py-1.5 backdrop-blur-sm">
                <Edit3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {getUserCommentsCount()} من تعليقاتك
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-200/30"></div>
        <div className="absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-purple-200/30"></div>
      </div>

      {/* Add Comment Form with Emoji Picker */}
      {user ? (
        <Card className="border-0 shadow-lg ring-1 ring-slate-200/50">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 shadow-md ring-2 ring-white">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-white">
                  {getFallback(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-slate-900">
                  {user.fullName}
                </h4>
                <p className="text-sm text-slate-500">أضف تعليقك الآن</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  ref={newCommentRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="شاركنا رأيك أو تعليقك حول هذه المدونة..."
                  className="min-h-[120px] resize-none border-slate-200 bg-slate-50/50 text-right placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-blue-500/20"
                  maxLength={MAX_COMMENT_LENGTH + 50}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="absolute top-3 left-3 h-8 w-8 p-0 text-slate-600 hover:bg-slate-100"
                  title="إضافة إيموجي"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                {newComment && (
                  <div className="absolute bottom-3 left-3">
                    <Badge
                      variant={
                        newCommentStats.isOverLimit
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {newCommentStats.length}/{MAX_COMMENT_LENGTH}
                    </Badge>
                  </div>
                )}
                {showEmojiPicker && (
                  <div className="absolute top-12 left-0 z-10">
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        handleEmojiClick(emojiData, false)
                      }
                      previewConfig={{ showPreview: false }}
                      skinTonesDisabled
                      height={350}
                      width={300}
                      searchPlaceholder="البحث عن إيموجي..."
                      categories={[
                        { name: "مقترحة", category: Categories.SUGGESTED },
                        { name: "مخصصة", category: Categories.CUSTOM },
                        {
                          name: "الابتسامات والأشخاص",
                          category: Categories.SMILEYS_PEOPLE,
                        },
                        {
                          name: "الحيوانات والطبيعة",
                          category: Categories.ANIMALS_NATURE,
                        },
                        {
                          name: "الطعام والشراب",
                          category: Categories.FOOD_DRINK,
                        },
                        {
                          name: "السفر والأماكن",
                          category: Categories.TRAVEL_PLACES,
                        },
                        { name: "الأنشطة", category: Categories.ACTIVITIES },
                        { name: "الأشياء", category: Categories.OBJECTS },
                        { name: "الرموز", category: Categories.SYMBOLS },
                        { name: "الأعلام", category: Categories.FLAGS },
                      ]}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {newCommentStats.isOverLimit ? (
                    <span className="flex items-center gap-1 font-medium text-red-500">
                      <X className="h-3 w-3" />
                      تجاوز الحد المسموح بـ{" "}
                      {Math.abs(newCommentStats.remaining)} حرف
                    </span>
                  ) : newComment.length > 0 ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Clock className="h-3 w-3" />
                      متبقي {newCommentStats.remaining} حرف
                    </span>
                  ) : (
                    <span>اكتب تعليقك (حد أقصى {MAX_COMMENT_LENGTH} حرف)</span>
                  )}
                </div>
                <Button
                  onClick={handleSubmitComment}
                  disabled={
                    isSubmitting ||
                    !newComment.trim() ||
                    newCommentStats.isOverLimit
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري النشر...
                    </div>
                  ) : (
                    <>
                      <Send className="ml-2 h-4 w-4" />
                      نشر التعليق
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg ring-1 ring-slate-200/50">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold text-slate-900">
              انضم للمناقشة
            </h4>
            <p className="mb-6 text-slate-600">
              سجل دخولك لتتمكن من إضافة تعليقاتك ومشاركة آرائك
            </p>
            <Link href={"/sign-in"}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                <User className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {!hasComments && comments.length === 0 && !isLoading ? (
          <Card className="border-0 shadow-lg ring-1 ring-slate-200/50">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-slate-100 to-slate-200">
                <MessageCircle className="h-6 w-6 text-slate-400" />
              </div>
              <h4 className="mb-3 text-xl font-semibold text-slate-900">
                لا توجد تعليقات حتى الآن
              </h4>
              <p className="text-lg text-slate-600">
                كن أول من يبدأ المناقشة حول هذا المقال
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {user && comments.length > 0 && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Edit3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 text-sm">
                    <h5 className="mb-1 font-medium text-blue-900">
                      تعديل وحذف التعليقات
                    </h5>
                    <p className="text-blue-700">
                      يمكنك تعديل أو حذف التعليقات التي كتبتها فقط. ابحث عن
                      أيقونات التعديل والحذف بجانب تعليقاتك.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {comments.map((comment) => (
              <Card
                key={comment.id}
                className={`group border-0 shadow-md ring-1 ring-slate-200/50 transition-all duration-200 hover:shadow-lg hover:ring-slate-300/50 ${
                  editingCommentId === comment.id
                    ? "shadow-blue-100 ring-blue-300"
                    : ""
                } ${
                  deletingCommentId === comment.id
                    ? "shadow-red-100 ring-red-300"
                    : ""
                }`}
              >
                <CardContent className="p-6">
                  {(editingCommentId === comment.id ||
                    deletingCommentId === comment.id) && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm">
                      {editingCommentId === comment.id ? (
                        <>
                          <Edit3 className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">
                            جاري تعديل التعليق...
                          </span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="text-red-700">
                            جاري حذف التعليق...
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 shadow-md ring-2 ring-white">
                      <AvatarImage
                        src={comment.author.image || ""}
                        alt={comment.author.name || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 font-semibold text-white">
                        {comment.author.name?.charAt(0) || "؟"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <h5 className="text-lg font-semibold text-slate-900">
                            {comment.author.name || "مستخدم مجهول"}
                          </h5>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-500">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </span>
                          {isCommentEdited(comment) && (
                            <Badge
                              variant="secondary"
                              className="border-amber-200 bg-amber-50 text-xs text-amber-700"
                            >
                              <Clock className="ml-1 h-3 w-3" />
                              معدّل
                            </Badge>
                          )}
                        </div>

                        {isCommentOwner(comment) && (
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="text-primary bg-secondary/20 border-primary/20 text-xs"
                            >
                              <User className="ml-1 h-3 w-3" />
                              مؤلف
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditComment(comment)}
                                className="h-8 w-8 p-0 text-blue-600 hover:cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                                title="تعديل التعليق"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:cursor-pointer hover:bg-red-50 hover:text-red-700"
                                title="حذف التعليق"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Edit Comment Form with Emoji Picker */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-4 rounded-lg bg-slate-50 p-4">
                          <div className="relative">
                            <Textarea
                              ref={editCommentRef}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[100px] resize-none border-slate-200 bg-white text-right focus:border-blue-500 focus:ring-blue-500/20"
                              placeholder="تعديل التعليق..."
                              maxLength={MAX_COMMENT_LENGTH + 50}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setShowEditEmojiPicker((prev) => !prev)
                              }
                              className="absolute top-3 left-3 h-8 w-8 p-0 text-slate-600 hover:bg-slate-100"
                              title="إضافة إيموجي"
                            >
                              <Smile className="h-5 w-5" />
                            </Button>
                            {editContent && (
                              <div className="absolute bottom-3 left-3">
                                <Badge
                                  variant={
                                    editCommentStats.isOverLimit
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {editCommentStats.length}/{MAX_COMMENT_LENGTH}
                                </Badge>
                              </div>
                            )}
                            {showEditEmojiPicker && (
                              <div className="absolute top-12 left-0 z-10">
                                <EmojiPicker
                                  onEmojiClick={(emojiData) =>
                                    handleEmojiClick(emojiData, true)
                                  }
                                  previewConfig={{ showPreview: false }}
                                  skinTonesDisabled
                                  height={350}
                                  width={300}
                                  searchPlaceholder="البحث عن إيموجي..."
                                  categories={[
                                    {
                                      name: "مقترحة",
                                      category: Categories.SUGGESTED,
                                    },
                                    {
                                      name: "مخصصة",
                                      category: Categories.CUSTOM,
                                    },
                                    {
                                      name: "الابتسامات والأشخاص",
                                      category: Categories.SMILEYS_PEOPLE,
                                    },
                                    {
                                      name: "الحيوانات والطبيعة",
                                      category: Categories.ANIMALS_NATURE,
                                    },
                                    {
                                      name: "الطعام والشراب",
                                      category: Categories.FOOD_DRINK,
                                    },
                                    {
                                      name: "السفر والأماكن",
                                      category: Categories.TRAVEL_PLACES,
                                    },
                                    {
                                      name: "الأنشطة",
                                      category: Categories.ACTIVITIES,
                                    },
                                    {
                                      name: "الأشياء",
                                      category: Categories.OBJECTS,
                                    },
                                    {
                                      name: "الرموز",
                                      category: Categories.SYMBOLS,
                                    },
                                    {
                                      name: "الأعلام",
                                      category: Categories.FLAGS,
                                    },
                                  ]}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              {editCommentStats.isOverLimit ? (
                                <span className="flex items-center gap-1 font-medium text-red-500">
                                  <X className="h-3 w-3" />
                                  تجاوز الحد المسموح بـ{" "}
                                  {Math.abs(editCommentStats.remaining)} حرف
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-green-600">
                                  <Clock className="h-3 w-3" />
                                  متبقي {editCommentStats.remaining} حرف
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="hover:cursor-pointer hover:bg-slate-100"
                              >
                                <X className="ml-1 h-4 w-4" />
                                إلغاء
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateComment(comment.id)}
                                disabled={
                                  isUpdating ||
                                  !editContent.trim() ||
                                  editCommentStats.isOverLimit
                                }
                                className="bg-green-600 shadow-md hover:cursor-pointer hover:bg-green-700"
                              >
                                {isUpdating ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    جاري الحفظ...
                                  </div>
                                ) : (
                                  <>
                                    <Save className="ml-1 h-4 w-4" />
                                    حفظ التغييرات
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-base leading-relaxed whitespace-pre-wrap text-slate-700">
                            {comment.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-8" ref={ref}>
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="text-center">
                    <p className="text-sm text-slate-600">
                      جاري تحميل المزيد من التعليقات...
                    </p>
                    {totalComments > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        تم تحميل {comments.length} من أصل {totalComments} تعليق
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!hasMore &&
              comments.length > 0 &&
              totalComments > comments.length && (
                <div className="flex justify-center py-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                    تم تحميل جميع التعليقات ({totalComments})
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent dir="rtl" className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              تأكيد حذف التعليق
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed text-slate-600">
              هل أنت متأكد من رغبتك في حذف هذا التعليق؟ هذا الإجراء لا يمكن
              التراجع عنه وسيتم حذف التعليق نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={cancelDeleteComment}
              className="hover:cursor-pointer hover:bg-slate-100"
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteComment}
              className="bg-red-600 shadow-md hover:cursor-pointer hover:bg-red-700"
            >
              <Trash2 className="ml-1 h-4 w-4" />
              حذف التعليق
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
