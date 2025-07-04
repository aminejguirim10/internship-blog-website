import { NextRequest, NextResponse } from "next/server"
import { checkEditor } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const editor = await checkEditor()

    if (!editor) {
      return NextResponse.json({ isEditor: false }, { status: 401 })
    }

    const isEditor = editor.role === "EDITOR" || editor.role === "ADMIN"

    return NextResponse.json({
      isEditor,
    })
  } catch (error) {
    return NextResponse.json(
      {
        isEditor: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
