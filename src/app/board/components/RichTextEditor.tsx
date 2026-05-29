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
        class: "rte-editor-inner",
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
    <div className={`rte-container ${readOnly ? "readonly" : ""}`}>
      {!readOnly && (
        <div className="rte-toolbar">
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
            className={`rte-btn ${editor.isActive("bold") ? "active" : ""}`}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
            className={`rte-btn ${editor.isActive("italic") ? "active" : ""}`}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <div className="rte-divider" />
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
            className={`rte-btn ${editor.isActive("bulletList") ? "active" : ""}`}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
            className={`rte-btn ${editor.isActive("orderedList") ? "active" : ""}`}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
        </div>
      )}

      <div className="rte-content-wrap">
        <style>{`
          .rte-editor-inner {
            outline: none;
            min-height: 100%;
          }
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #94a3b8;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror strong { font-weight: 700; color: #0f172a; }
          .ProseMirror em { font-style: italic; }
          .ProseMirror ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
          .ProseMirror ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
          .ProseMirror li { margin-bottom: 0.25rem; }
          .ProseMirror p { margin-bottom: 0.5rem; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
