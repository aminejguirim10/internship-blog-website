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
  TableIcon,
  Minus,
  Undo,
  Redo,
  Indent,
  Outdent,
  RemoveFormatting,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"

// Extension personnalisée pour la taille de police
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

  const editor = useEditor({
    extensions: [
      StarterKit,
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
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      updateCurrentColors()
    },
    onSelectionUpdate: ({ editor }) => {
      updateCurrentColors()
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6",
      },
    },
  })

  // Fonction pour mettre à jour les couleurs actuelles basées sur la sélection
  const updateCurrentColors = useCallback(() => {
    if (!editor) return

    // Récupérer la couleur du texte actuel
    const textColor = editor.getAttributes("textStyle").color
    if (textColor) {
      setCurrentTextColor(textColor)
      setSelectedTextColor(textColor)
    } else {
      setCurrentTextColor("#000000")
      setSelectedTextColor("#000000")
    }

    // Récupérer la couleur de surlignage actuelle
    const highlightColor = editor.getAttributes("highlight").color
    if (highlightColor) {
      setCurrentHighlightColor(highlightColor)
      setSelectedHighlightColor(highlightColor)
    } else if (editor.isActive("highlight")) {
      // Si le surlignage est actif mais sans couleur spécifique, utiliser jaune par défaut
      setCurrentHighlightColor("#FFFF00")
      setSelectedHighlightColor("#FFFF00")
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      updateCurrentColors()
    }
  }, [editor, updateCurrentColors])

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt("رابط الموقع:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  // Fonction améliorée pour appliquer la couleur du texte
  const applyTextColor = (color: string) => {
    if (editor.state.selection.empty) {
      // Si aucune sélection, définir la couleur pour le prochain texte tapé
      editor.chain().focus().setColor(color).run()
    } else {
      // Si du texte est sélectionné, appliquer la couleur à la sélection
      editor.chain().focus().setColor(color).run()
    }
    setCurrentTextColor(color)
    setSelectedTextColor(color)
  }

  // Fonction améliorée pour appliquer la couleur de surlignage
  const applyHighlightColor = (color: string) => {
    if (editor.state.selection.empty) {
      // Si aucune sélection, définir la couleur pour le prochain texte tapé
      editor.chain().focus().toggleHighlight({ color }).run()
    } else {
      // Si du texte est sélectionné, appliquer le surlignage à la sélection
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setCurrentHighlightColor(color)
    setSelectedHighlightColor(color)
  }

  // Fonction pour supprimer la couleur du texte
  const removeTextColor = () => {
    editor.chain().focus().unsetColor().run()
    setCurrentTextColor("#000000")
    setSelectedTextColor("#000000")
  }

  // Fonction pour supprimer le surlignage
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
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onValueChange={(value) => {
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
          value={editor.getAttributes("textStyle").fontSize || ""}
          onValueChange={(value) => {
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

        {/* Text Color Picker - Amélioré */}
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
                    "#DDA0DD",
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
                  className="flex-1"
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

        {/* Highlight Color Picker - Amélioré */}
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
                    "#3F37C9",
                    "#4CC9F0",
                    "#4895EF",
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
                    "#FBBF24",
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
                  className="flex-1"
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
          }}
          title="مسح التنسيق"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-slate-300" />

        {/* Headers */}
        <Select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : editor.isActive("heading", { level: 4 })
                    ? "h4"
                    : editor.isActive("heading", { level: 5 })
                      ? "h5"
                      : editor.isActive("heading", { level: 6 })
                        ? "h6"
                        : "p"
          }
          onValueChange={(value) => {
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

        {/* Lists */}
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

        {/* Indentation */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
          title="زيادة المسافة البادئة"
        >
          <Indent className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
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

        {/* Quote and Code */}
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
          onClick={insertTable}
          title="إدراج جدول"
        >
          <TableIcon className="h-4 w-4" />
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
      <EditorContent
        editor={editor}
        className="min-h-[400px] focus-within:outline-none"
      />

      {!content && (
        <div className="pointer-events-none absolute top-30 right-6 text-slate-400">
          {placeholder || "ابدأ في كتابة قصتك..."}
        </div>
      )}
    </div>
  )
}
