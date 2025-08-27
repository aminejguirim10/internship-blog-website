"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import Underline from "@tiptap/extension-underline"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import ListItem from "@tiptap/extension-list-item"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import { Extension } from "@tiptap/core"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bold,
  Italic,
  Strikethrough,
  UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  Highlighter,
  Type,
  SubscriptIcon,
  SuperscriptIcon,
  Minus,
  Undo,
  Redo,
  Indent,
  Outdent,
  RemoveFormatting,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"

// Custom extension for font size
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  //@ts-ignore
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: any }) => {
          //@ts-ignore
          return chain().setMark("textStyle", { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: any }) => {
          //@ts-ignore
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [currentTextColor, setCurrentTextColor] = useState("#000000")
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#FFFF00")
  const [selectedTextColor, setSelectedTextColor] = useState("#000000")
  const [selectedHighlightColor, setSelectedHighlightColor] =
    useState("#FFFF00")
  const [fontFamily, setFontFamily] = useState("default")
  const [fontSize, setFontSize] = useState("default")
  const [heading, setHeading] = useState("p")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default bullet list and ordered list from StarterKit
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      // Configure lists properly
      ListItem.configure({
        HTMLAttributes: {
          class: "leading-normal",
        },
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: "list-disc space-y-1 my-4 pr-6",
        },
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
        HTMLAttributes: {
          class: "list-decimal space-y-1 my-4 pr-6",
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "px-1 rounded",
        },
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-gray-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class:
            "border border-gray-300 px-3 py-2 break-words w-32 min-w-[120px] max-w-[200px]",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      updateCurrentColors()
      updateSelectionStates()
    },
    onSelectionUpdate: ({ editor }) => {
      updateCurrentColors()
      updateSelectionStates()
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6",
      },
    },
  })

  // Function to update current colors based on selection
  const updateCurrentColors = useCallback(() => {
    if (!editor) return

    // Get current text color
    const textColor = editor.getAttributes("textStyle").color
    if (textColor) {
      setCurrentTextColor(textColor)
      setSelectedTextColor(textColor)
    } else {
      setCurrentTextColor("#000000")
      setSelectedTextColor("#000000")
    }

    // Get current highlight color
    const highlightColor = editor.getAttributes("highlight").color
    if (highlightColor) {
      setCurrentHighlightColor(highlightColor)
      setSelectedHighlightColor(highlightColor)
    } else if (editor.isActive("highlight")) {
      // If highlight is active but without specific color, use default yellow
      setCurrentHighlightColor("#FFFF00")
      setSelectedHighlightColor("#FFFF00")
    }
  }, [editor])

  // Function to update selection states
  const updateSelectionStates = useCallback(() => {
    if (!editor) return

    // Update font family
    const currentFontFamily = editor.getAttributes("textStyle").fontFamily
    setFontFamily(currentFontFamily || "default")

    // Update font size
    const currentFontSize = editor.getAttributes("textStyle").fontSize
    setFontSize(currentFontSize || "default")

    // Update heading
    if (editor.isActive("heading", { level: 1 })) {
      setHeading("h1")
    } else if (editor.isActive("heading", { level: 2 })) {
      setHeading("h2")
    } else if (editor.isActive("heading", { level: 3 })) {
      setHeading("h3")
    } else if (editor.isActive("heading", { level: 4 })) {
      setHeading("h4")
    } else if (editor.isActive("heading", { level: 5 })) {
      setHeading("h5")
    } else if (editor.isActive("heading", { level: 6 })) {
      setHeading("h6")
    } else {
      setHeading("p")
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      updateCurrentColors()
      updateSelectionStates()
    }
  }, [editor, updateCurrentColors, updateSelectionStates])

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt("رابط الموقع:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  // Enhanced function to apply text color
  const applyTextColor = (color: string) => {
    if (editor.state.selection.empty) {
      // If no selection, set color for next typed text
      editor.chain().focus().setColor(color).run()
    } else {
      // If text is selected, apply color to selection
      editor.chain().focus().setColor(color).run()
    }
    setCurrentTextColor(color)
    setSelectedTextColor(color)
  }

  // Enhanced function to apply highlight color
  const applyHighlightColor = (color: string) => {
    if (editor.state.selection.empty) {
      // If no selection, set color for next typed text
      editor.chain().focus().toggleHighlight({ color }).run()
    } else {
      // If text is selected, apply highlight to selection
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setCurrentHighlightColor(color)
    setSelectedHighlightColor(color)
  }

  // Function to remove text color
  const removeTextColor = () => {
    editor.chain().focus().unsetColor().run()
    setCurrentTextColor("#000000")
    setSelectedTextColor("#000000")
  }

  // Function to remove highlight
  const removeHighlight = () => {
    editor.chain().focus().unsetHighlight().run()
    setCurrentHighlightColor("#FFFF00")
    setSelectedHighlightColor("#FFFF00")
  }

  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-200 bg-white"
      dir="rtl"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-3">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="تراجع"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="إعادة"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Font Family */}
        <Select
          value={fontFamily}
          onValueChange={(value) => {
            setFontFamily(value)
            if (value === "default") {
              editor.chain().focus().unsetFontFamily().run()
            } else {
              editor.chain().focus().setFontFamily(value).run()
            }
          }}
        >
          <SelectTrigger className="h-8 w-36">
            <SelectValue placeholder="نوع الخط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">افتراضي</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
            <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
            <SelectItem value="Impact">Impact</SelectItem>
            <SelectItem value="Palatino">Palatino</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select
          value={fontSize}
          onValueChange={(value) => {
            setFontSize(value)
            if (value === "default") {
              //@ts-ignore
              editor.chain().focus().unsetFontSize().run()
            } else {
              //@ts-ignore
              editor.chain().focus().setFontSize(value).run()
            }
          }}
        >
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="الحجم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">افتراضي</SelectItem>
            <SelectItem value="10px">10</SelectItem>
            <SelectItem value="12px">12</SelectItem>
            <SelectItem value="14px">14</SelectItem>
            <SelectItem value="16px">16</SelectItem>
            <SelectItem value="18px">18</SelectItem>
            <SelectItem value="20px">20</SelectItem>
            <SelectItem value="24px">24</SelectItem>
            <SelectItem value="28px">28</SelectItem>
            <SelectItem value="32px">32</SelectItem>
            <SelectItem value="36px">36</SelectItem>
            <SelectItem value="48px">48</SelectItem>
          </SelectContent>
        </Select>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-slate-200" : ""}
          title="عريض"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-slate-200" : ""}
          title="مائل"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-slate-200" : ""}
          title="تحته خط"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-slate-200" : ""}
          title="يتوسطه خط"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Text Color Picker - Enhanced */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`relative ${editor.getAttributes("textStyle").color ? "bg-blue-50" : ""}`}
              title={`لون النص (${currentTextColor})`}
            >
              <Type className="h-4 w-4" />
              <div
                className="absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 transform rounded shadow-sm"
                style={{ backgroundColor: currentTextColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">لون النص</Label>
                <div className="text-xs text-slate-500">{currentTextColor}</div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={selectedTextColor}
                  onChange={(e) => {
                    setSelectedTextColor(e.target.value)
                    applyTextColor(e.target.value)
                  }}
                  className="h-8 w-12 cursor-pointer rounded border p-1"
                />
                <Input
                  type="text"
                  value={selectedTextColor}
                  onChange={(e) => {
                    const color = e.target.value
                    if (
                      color.match(/^#[0-9A-F]{6}$/i) ||
                      color.match(/^#[0-9A-F]{3}$/i)
                    ) {
                      setSelectedTextColor(color)
                      applyTextColor(color)
                    } else {
                      setSelectedTextColor(color)
                    }
                  }}
                  className="h-8 flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>

              <div>
                <Label className="mb-2 block text-xs text-slate-600">
                  الألوان السريعة
                </Label>
                <div className="grid grid-cols-10 gap-1">
                  {[
                    "#000000",
                    "#333333",
                    "#666666",
                    "#999999",
                    "#CCCCCC",
                    "#FFFFFF",
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FFFF00",
                    "#FF00FF",
                    "#00FFFF",
                    "#800000",
                    "#008000",
                    "#000080",
                    "#808000",
                    "#800080",
                    "#008080",
                    "#FFA500",
                    "#FFC0CB",
                    "#A52A2A",
                    "#DDA0DD",
                    "#98FB98",
                    "#F0E68C",
                    "#E6E6FA",
                    "#FFE4E1",
                    "#F5DEB3",
                    "#D2B48C",
                    "#BC8F8F",
                    "#F4A460",
                    "#DAA520",
                    "#CD853F",
                    "#4169E1",
                    "#32CD32",
                    "#FF6347",
                    "#40E0D0",
                    "#EE82EE",
                    "#90EE90",
                    "#FFB6C1",
                    "#FFA07A",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-6 w-6 rounded border-2 transition-all duration-200 hover:scale-110 ${
                        currentTextColor === color
                          ? "border-blue-500 shadow-md"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => applyTextColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeTextColor}
                  className="flex-1 bg-transparent"
                >
                  إزالة اللون
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyTextColor(selectedTextColor)}
                  className="flex-1"
                >
                  تطبيق
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight Color Picker - Enhanced */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`relative ${editor.isActive("highlight") ? "bg-yellow-50" : ""}`}
              title={`لون التمييز (${currentHighlightColor})`}
            >
              <Highlighter className="h-4 w-4" />
              <div
                className="absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 transform rounded shadow-sm"
                style={{ backgroundColor: currentHighlightColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">لون التمييز</Label>
                <div className="text-xs text-slate-500">
                  {currentHighlightColor}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={selectedHighlightColor}
                  onChange={(e) => {
                    setSelectedHighlightColor(e.target.value)
                    applyHighlightColor(e.target.value)
                  }}
                  className="h-8 w-12 cursor-pointer rounded border p-1"
                />
                <Input
                  type="text"
                  value={selectedHighlightColor}
                  onChange={(e) => {
                    const color = e.target.value
                    if (
                      color.match(/^#[0-9A-F]{6}$/i) ||
                      color.match(/^#[0-9A-F]{3}$/i)
                    ) {
                      setSelectedHighlightColor(color)
                      applyHighlightColor(color)
                    } else {
                      setSelectedHighlightColor(color)
                    }
                  }}
                  className="h-8 flex-1 font-mono text-sm"
                  placeholder="#FFFF00"
                />
              </div>

              <div>
                <Label className="mb-2 block text-xs text-slate-600">
                  ألوان التمييز
                </Label>
                <div className="grid grid-cols-10 gap-1">
                  {[
                    "#FFFF00",
                    "#FFE135",
                    "#FFCC02",
                    "#FF9500",
                    "#FF6B35",
                    "#FF3838",
                    "#FF006E",
                    "#8338EC",
                    "#3A86FF",
                    "#06FFA5",
                    "#C7F464",
                    "#F72585",
                    "#B5179E",
                    "#7209B7",
                    "#480CA8",
                    "#4CC9F0",
                    "#4895EF",
                    "#488B8E",
                    "#4361EE",
                    "#3F37C9",
                    "#FEF3C7",
                    "#DBEAFE",
                    "#D1FAE5",
                    "#FEE2E2",
                    "#FECACA",
                    "#FED7AA",
                    "#E0E7FF",
                    "#C7D2FE",
                    "#A7F3D0",
                    "#FDE047",
                    "#A3E635",
                    "#34D399",
                    "#22D3EE",
                    "#60A5FA",
                    "#A78BFA",
                    "#F472B6",
                    "#FB7185",
                    "#FBBF24",
                    "#F59E0B",
                    "#89F0F6",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-6 w-6 rounded border-2 transition-all duration-200 hover:scale-110 ${
                        currentHighlightColor === color
                          ? "border-blue-500 shadow-md"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => applyHighlightColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeHighlight}
                  className="flex-1 bg-transparent"
                >
                  إزالة التمييز
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyHighlightColor(selectedHighlightColor)}
                  className="flex-1"
                >
                  تطبيق
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Subscript/Superscript */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive("subscript") ? "bg-slate-200" : ""}
          title="منخفض"
        >
          <SubscriptIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive("superscript") ? "bg-slate-200" : ""}
          title="مرتفع"
        >
          <SuperscriptIcon className="h-4 w-4" />
        </Button>

        {/* Clear Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            editor.chain().focus().clearNodes().unsetAllMarks().run()
            setCurrentTextColor("#000000")
            setCurrentHighlightColor("#FFFF00")
            setSelectedTextColor("#000000")
            setSelectedHighlightColor("#FFFF00")
            setFontFamily("default")
            setFontSize("default")
            setHeading("p")
          }}
          title="مسح التنسيق"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Headers */}
        <Select
          value={heading}
          onValueChange={(value) => {
            setHeading(value)
            if (value === "p") {
              editor.chain().focus().setParagraph().run()
            } else {
              const level = Number.parseInt(value.replace("h", "")) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6
              editor.chain().focus().toggleHeading({ level }).run()
            }
          }}
        >
          <SelectTrigger className="h-8 w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">فقرة</SelectItem>
            <SelectItem value="h1">عنوان 1</SelectItem>
            <SelectItem value="h2">عنوان 2</SelectItem>
            <SelectItem value="h3">عنوان 3</SelectItem>
            <SelectItem value="h4">عنوان 4</SelectItem>
            <SelectItem value="h5">عنوان 5</SelectItem>
            <SelectItem value="h6">عنوان 6</SelectItem>
          </SelectContent>
        </Select>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Lists - Fixed implementation */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
          title="قائمة نقطية"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-slate-200" : ""}
          title="قائمة مرقمة"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* Indentation - Fixed for lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (editor.can().sinkListItem("listItem")) {
              editor.chain().focus().sinkListItem("listItem").run()
            }
          }}
          disabled={!editor.can().sinkListItem("listItem")}
          title="زيادة المسافة البادئة"
        >
          <Indent className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (editor.can().liftListItem("listItem")) {
              editor.chain().focus().liftListItem("listItem").run()
            }
          }}
          disabled={!editor.can().liftListItem("listItem")}
          title="تقليل المسافة البادئة"
        >
          <Outdent className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-slate-200" : ""
          }
          title="محاذاة لليسار"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-slate-200" : ""
          }
          title="محاذاة للوسط"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-slate-200" : ""
          }
          title="محاذاة لليمين"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-slate-200" : ""
          }
          title="ضبط"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Quote and Code - Fixed blockquote */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-slate-200" : ""}
          title="اقتباس"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-slate-200" : ""}
          title="كتلة كود"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Links and Table */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          title="إدراج رابط"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="خط أفقي"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="min-h-[400px] focus-within:outline-none"
        />

        {/* Placeholder - Fixed positioning */}
        {!content && (
          <div className="pointer-events-none absolute top-6 right-6 text-slate-400">
            {placeholder || "ابدأ في كتابة قصتك..."}
          </div>
        )}
      </div>

      {/* Table Controls - Show when table is selected */}
      {editor.isActive("table") && (
        <div className="border-t border-slate-200 bg-slate-50 p-2">
          <div className="flex flex-wrap gap-1 text-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="إضافة صف قبل"
              className="text-xs"
            >
              + صف قبل
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="إضافة صف بعد"
              className="text-xs"
            >
              + صف بعد
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="حذف صف"
              className="text-xs text-red-600"
            >
              - صف
            </Button>
            <div className="mx-1 h-6 w-px bg-slate-300" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="إضافة عمود قبل"
              className="text-xs"
            >
              + عمود قبل
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="إضافة عمود بعد"
              className="text-xs"
            >
              + عمود بعد
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="حذف عمود"
              className="text-xs text-red-600"
            >
              - عمود
            </Button>
            <div className="mx-1 h-6 w-px bg-slate-300" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().mergeCells().run()}
              title="دمج خلايا"
              className="text-xs"
              disabled={!editor.can().mergeCells()}
            >
              دمج
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().splitCell().run()}
              title="تقسيم خلية"
              className="text-xs"
              disabled={!editor.can().splitCell()}
            >
              تقسيم
            </Button>
            <div className="mx-1 h-6 w-px bg-slate-300" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="حذف جدول"
              className="text-xs text-red-600"
            >
              🗑 حذف جدول
            </Button>
          </div>
        </div>
      )}

      {/* Custom CSS for better styling */}
      <style jsx>{`
        .ProseMirror {
          outline: none;
        }

        .ProseMirror blockquote {
          border-right: 3px solid #cbd5e1;
          padding-right: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #64748b;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.375rem;
        }

        .ProseMirror pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: "Courier New", monospace;
          overflow-x: auto;
        }

        .ProseMirror code {
          background-color: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: "Courier New", monospace;
          font-size: 0.875em;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .ProseMirror ul {
          list-style-type: disc;
          list-style-position: outside;
          padding-right: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          list-style-position: outside;
          padding-right: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        /* Improved table styling for responsiveness */
        .ProseMirror .tableWrapper {
          margin: 1rem 0;
          overflow-x: auto;
          max-width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #e2e8f0;
          width: 100%;
          box-sizing: border-box;
          position: relative;
        }

        /* Responsive behavior for mobile devices */

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  )
}
