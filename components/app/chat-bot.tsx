"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Send,
  Search,
  Calendar,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/app/api/chat/route"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { MarkdownComponents } from "@/components/app/markdowns"
import { Textarea } from "../ui/textarea"

interface BlogResult {
  id: string | number
  title: string
  summary?: string
  content?: string
  author: string
  category: string
  tags: string[]
  commentsCount: number
  viewsCount: number
  createdAt: string
  url: string
}

interface EventResult {
  id: string | number
  title: string
  description?: string
  summary?: string
  date: string
  hour?: string
  link?: string
  image?: string
  url: string
}

type ToolResult =
  | string
  | BlogResult[]
  | EventResult[]
  | BlogResult
  | EventResult

interface ToolPart {
  type: string
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error"
  input?: Record<string, unknown>
  output?: ToolResult
  error?: string | object
  errorText?: string
  message?: string
  stack?: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status } = useChat<ChatMessage>()

  useEffect(() => {
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages, status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "submitted" || status === "streaming")
      return

    sendMessage({ text: input })
    setInput("")
  }

  const isProcessing = status === "submitted" || status === "streaming"

  const getToolIcon = (toolType: string) => {
    if (toolType.includes("Blog")) return <FileText className="h-4 w-4" />
    if (toolType.includes("Event")) return <Calendar className="h-4 w-4" />
    return <Search className="h-4 w-4" />
  }

  const getToolLabel = (toolType: string) => {
    const toolLabels: Record<string, string> = {
      getBlogByTitle: "البحث عن مدونة",
      searchBlogsByContent: "البحث في المدونات",
      getBlogsByTags: "البحث بالعلامات",
      getLatestBlogs: "أحدث المدونات",
      getBlogSummary: "ملخص المدونة",
      getEventByTitle: "البحث عن حدث",
      getLatestEvents: "أحدث الأحداث",
      getEventSummary: "ملخص الحدث",
      searchSimilarEvents: "الأحداث المشابهة",
      getLatestBlogsByCategory: "أحدث المدونات بالفئة",
      getMostViewedBlogs: "المدونات الأكثر مشاهدة",
      getMostViewedBlogsByCategory: "الأكثر مشاهدة بالفئة",
      getMostCommentedBlogs: "المدونات الأكثر تعليقاً",
    }
    return toolLabels[toolType] || "أداة البحث"
  }

  // Mapping names to Arabic labels
  const inputFieldLabels: Record<string, string> = {
    title: "العنوان",
    phrase: "العبارة",
    tagName: "اسم العلامة",
    eventName: "اسم الحدث",
    categoryName: "اسم الفئة",
    limit: "العدد",
    blogName: "اسم المقال",
  }

  const renderToolResult = (result: ToolResult, toolType: string) => {
    if (typeof result === "string") {
      return (
        <div className="text-sm">
          <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {result}
          </ReactMarkdown>
        </div>
      )
    }

    if (Array.isArray(result)) {
      return (
        <div className="space-y-2">
          {result.map((item, index) => (
            <div
              key={index}
              className="rounded border-r-4 border-blue-500 bg-blue-50 p-3"
            >
              {item.url ? (
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer font-semibold text-blue-900 hover:text-blue-700 hover:underline"
                >
                  {item.title}
                </Link>
              ) : (
                <h4 className="font-semibold text-blue-900">{item.title}</h4>
              )}
              {"summary" in item && item.summary && (
                <div className="mt-1">
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkGfm]}
                  >
                    {item.summary}
                  </ReactMarkdown>
                </div>
              )}
              {"description" in item && item.description && (
                <div className="mt-1">
                  <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkGfm]}
                  >
                    {item.description}
                  </ReactMarkdown>
                </div>
              )}
              {"author" in item && item.author && (
                <p className="mt-1 text-xs text-gray-500">
                  بواسطة: {item.author}
                </p>
              )}
              {"category" in item && item.category && (
                <p className="mt-1 text-xs text-gray-500">
                  التصنيف: {item.category}
                </p>
              )}
              {("date" in item
                ? item.date
                : "createdAt" in item
                  ? item.createdAt
                  : undefined) && (
                <p className="mt-1 text-xs text-gray-500">
                  التاريخ: {"date" in item ? item.date : item.createdAt}
                </p>
              )}
              {"tags" in item && item.tags && item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="rounded-full bg-blue-200 px-2 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="rounded border-r-4 border-green-500 bg-green-50 p-3">
        {result.url ? (
          <Link
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer font-semibold text-green-900 hover:text-green-700 hover:underline"
          >
            {result.title}
          </Link>
        ) : (
          <h4 className="font-semibold text-green-900">{result.title}</h4>
        )}
        {"summary" in result && result.summary && (
          <div className="mt-1">
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {result.summary}
            </ReactMarkdown>
          </div>
        )}
        {"content" in result && result.content && (
          <div className="mt-1">
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {result.content}
            </ReactMarkdown>
          </div>
        )}
        {"description" in result && result.description && (
          <div className="mt-1">
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {result.description}
            </ReactMarkdown>
          </div>
        )}
        {"author" in result && result.author && (
          <p className="mt-1 text-xs text-gray-500">بواسطة: {result.author}</p>
        )}
        {"category" in result && result.category && (
          <p className="mt-1 text-xs text-gray-500">
            التصنيف: {result.category}
          </p>
        )}
        {("date" in result
          ? result.date
          : "createdAt" in result
            ? result.createdAt
            : undefined) && (
          <p className="mt-1 text-xs text-gray-500">
            التاريخ: {"date" in result ? result.date : result.createdAt}
          </p>
        )}
        {"hour" in result && result.hour && (
          <p className="mt-1 text-xs text-gray-500">الوقت: {result.hour}</p>
        )}
        {"tags" in result && result.tags && result.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {result.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full bg-green-200 px-2 py-1 text-xs text-green-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderToolPart = (
    part: ToolPart,
    toolName: string,
    partKey: string
  ) => {
    if (!("state" in part)) return null

    switch (part.state) {
      case "input-streaming":
        return (
          <div
            key={partKey}
            className="mx-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
          >
            <div className="flex items-center gap-2 text-sm text-blue-600">
              {getToolIcon(toolName)}
              <span>جاري استلام طلب {getToolLabel(toolName)}...</span>
            </div>
          </div>
        )

      case "input-available":
        return (
          <div
            key={partKey}
            className="mx-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
          >
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              {getToolIcon(toolName)}
              <span>{getToolLabel(toolName)}...</span>
            </div>
            {part.input && (
              <div className="mt-1 text-xs text-gray-600">
                {Object.entries(part.input).map(([key, value]) => (
                  <span key={key} className="block">
                    {inputFieldLabels[key] || key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )

      case "output-available":
        return (
          <div
            key={partKey}
            className="mx-2 rounded-lg border border-green-200 bg-green-50 p-3"
          >
            <div className="mb-3 flex items-center gap-2 text-sm text-green-700">
              {getToolIcon(toolName)}
              <span>نتائج {getToolLabel(toolName)}</span>
            </div>
            {part.output && (
              <div>{renderToolResult(part.output, toolName)}</div>
            )}
          </div>
        )

      case "output-error":
        return (
          <div
            key={partKey}
            className="mx-2 rounded-lg border border-red-200 bg-red-50 p-3"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-700">
              {getToolIcon(toolName)}
              <span>خطأ في {getToolLabel(toolName)}</span>
            </div>
            <div className="text-sm text-red-600">
              {part.error
                ? `خطأ: ${typeof part.error === "string" ? part.error : JSON.stringify(part.error)}`
                : part.errorText
                  ? `خطأ: ${part.errorText}`
                  : part.message
                    ? `خطأ: ${part.message}`
                    : "حدث خطأ غير متوقع أثناء تنفيذ العملية"}
            </div>
            {part.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-red-500">
                  عرض التفاصيل التقنية
                </summary>
                <pre className="mt-1 overflow-x-auto text-xs text-red-400">
                  {part.stack}
                </pre>
              </details>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {isOpen && (
        <Card
          className={`animate-in slide-in-from-bottom-2 bg-background fixed right-4 bottom-20 z-50 flex ${messages.length === 0 ? "h-[300px]" : "h-[550px]"} w-80 flex-col border-2 py-0 shadow-2xl sm:w-96`}
        >
          <CardHeader className="from-primary to-primary/80 text-primary-foreground flex flex-shrink-0 flex-row items-center justify-between space-y-0 rounded-t-lg bg-gradient-to-r py-3">
            <CardTitle className="text-base font-semibold">
              مساعد الموقع
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full p-0 hover:cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="-mt-[22px] flex flex-1 flex-col overflow-hidden rounded-b-lg p-0">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full" dir="rtl">
                <div ref={scrollRef} className="space-y-3 p-4">
                  {messages.length === 0 && (
                    <div className="text-muted-foreground px-4 py-1 text-center text-sm">
                      <div className="border-primary/20 bg-primary/10 rounded-lg border p-4">
                        مرحباً! أنا مساعدك الذكي لموقع المدونات التركي. يمكنني
                        مساعدتك في البحث عن المدونات والأحداث والإجابة على
                        أسئلتك حول الموقع.
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      {message.parts?.map((part, i) => {
                        const partKey = `${message.id}-${i}`

                        if (part.type === "text") {
                          return (
                            <div
                              key={partKey}
                              className={cn(
                                "flex w-full",
                                message.role === "user"
                                  ? "justify-start"
                                  : "justify-end"
                              )}
                            >
                              <div
                                className={cn(
                                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words",
                                  message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-md shadow-md"
                                    : "rounded-bl-md border bg-gray-100 text-gray-800 shadow-sm"
                                )}
                              >
                                {message.role === "user" ? (
                                  <div className="whitespace-pre-wrap">
                                    {part.text}
                                  </div>
                                ) : (
                                  <ReactMarkdown
                                    components={MarkdownComponents}
                                    remarkPlugins={[remarkGfm]}
                                  >
                                    {part.text}
                                  </ReactMarkdown>
                                )}
                              </div>
                            </div>
                          )
                        }

                        const toolMatch = part.type.match(/^tool-(.+)$/)
                        if (toolMatch) {
                          const toolName = toolMatch[1]
                          return renderToolPart(
                            part as ToolPart,
                            toolName,
                            partKey
                          )
                        }

                        return null
                      })}
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-bl-md border bg-gray-100 px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 border-t bg-gray-50/50 p-4">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3" dir="rtl">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا... يمكنك أن تسأل عن المدونات أو الأحداث"
                    className="focus:border-primary focus:ring-primary/20 h-4 flex-1 resize-none rounded-2xl border-gray-200 bg-white px-4 py-2 text-right max-sm:px-2 max-sm:py-1 max-sm:text-sm"
                    disabled={isProcessing}
                    rows={2}
                    maxLength={1000}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isProcessing || !input.trim()}
                    className="bg-primary hover:bg-primary/90 -ml-1 h-10 w-10 rounded-full shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-4 bottom-4 z-40 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl",
          "from-primary to-primary/80 hover:from-primary/90 hover:to-primary bg-gradient-to-r",
          "transform hover:scale-110 active:scale-95",
          isOpen && "rotate-180"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </>
  )
}
