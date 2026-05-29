"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Markdown.configure({ linkify: true, breaks: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: content,
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const markdown = (editor.storage as unknown as Record<string, { getMarkdown: () => string }>).markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none max-w-none text-[13px] leading-relaxed text-gray-500",
      },
    },
  });

  useEffect(() => {
    if (
      editor &&
      content !== (editor.storage as unknown as Record<string, { getMarkdown: () => string }>).markdown.getMarkdown()
    ) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div
      className={`w-full bg-white border border-gray-100 rounded-xl overflow-hidden transition-all focus-within:border-blue-200 focus-within:shadow-sm ${
        readOnly ? "opacity-80 bg-gray-50/20" : ""
      }`}
    >
      {!readOnly && (
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 border-b border-gray-100">
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
            className={`p-1.5 rounded-md transition-all ${editor.isActive("bold") ? "bg-white text-blue-900 shadow-sm" : "text-gray-400 hover:text-blue-900 hover:bg-white"}`}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
            className={`p-1.5 rounded-md transition-all ${editor.isActive("italic") ? "bg-white text-blue-900 shadow-sm" : "text-gray-400 hover:text-blue-900 hover:bg-white"}`}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <div className="w-px h-3 bg-gray-300 mx-1" />
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
            className={`p-1.5 rounded-md transition-all ${editor.isActive("bulletList") ? "bg-white text-blue-900 shadow-sm" : "text-gray-400 hover:text-blue-900 hover:bg-white"}`}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
            className={`p-1.5 rounded-md transition-all ${editor.isActive("orderedList") ? "bg-white text-blue-900 shadow-sm" : "text-gray-400 hover:text-blue-900 hover:bg-white"}`}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
        </div>
      )}

      <div className="p-4 min-h-[148px]">
        <style>{`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror strong { font-weight: 700; color: #111827; }
          .ProseMirror em { font-style: italic; }
          .ProseMirror ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
          .ProseMirror ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
          .ProseMirror li { margin-bottom: 0.25rem; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
