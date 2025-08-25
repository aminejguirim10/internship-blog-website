"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status } = useChat()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status === "submitted" || status === "streaming")
      return

    sendMessage({ text: input })
    setInput("")
  }

  const isProcessing = status === "submitted" || status === "streaming"

  return (
    <>
      {/* Chat Interface */}
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

          <CardContent className="-mt-6 flex flex-1 flex-col overflow-hidden rounded-b-lg p-0">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full" dir="rtl">
                <div ref={scrollRef} className="space-y-3 p-4">
                  {messages.length === 0 && (
                    <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                      <div className="border-primary/20 bg-primary/10 rounded-lg border p-4">
                        مرحباً! أنا مساعدك الذكي لموقع المدونات التركي. كيف
                        يمكنني مساعدتك اليوم؟
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
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
                        {message.parts?.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="whitespace-pre-wrap"
                              >
                                {part.text}
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
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
                </div>
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 border-t bg-gray-50/50 p-4">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2" dir="rtl">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="focus:border-primary focus:ring-primary/20 flex-1 rounded-full border-gray-200 bg-white px-4 py-2 text-right"
                    disabled={isProcessing}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isProcessing || !input.trim()}
                    className="bg-primary hover:bg-primary/90 h-10 w-10 rounded-full shadow-md"
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
