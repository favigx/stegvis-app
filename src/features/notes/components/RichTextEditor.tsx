import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Gapcursor from "@tiptap/extension-gapcursor";
import containerStyles from "../../../layout/Container.module.css";

import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export function RichTextEditor({ content = "", onChange }: RichTextEditorProps) {
  const lastHtmlRef = useRef<string>("");     
  const settingContentRef = useRef<boolean>(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Gapcursor,
    ],
    content,
    editorProps: {
      attributes: {
        class: "ProseMirror " + containerStyles.textarea,
        style: "min-height: 100%; height: 100%; outline: none; box-shadow: none;",
      },
    },
  });

  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current) {
      settingContentRef.current = true;
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor || !onChange) return;

    const handleUpdate = () => {
      if (settingContentRef.current) {
        settingContentRef.current = false;
        return;
      }
      const html = editor.getHTML();
      if (html === lastHtmlRef.current) return;
      lastHtmlRef.current = html;
      onChange(html);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange]);

  if (!editor) return null;

  const buttonStyle = (active: boolean) => ({
    backgroundColor: active ? "#51569bff" : "#1b2146",
    color: "#fff",
    border: "1px solid #343155",
    borderRadius: "3px",
    padding: "3px 6px",
    cursor: "pointer",
    marginRight: "4px",
    fontSize: "14px",
  });

  const safe = (fn: () => void) => () => { if (editor) fn(); };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleBold().run())} style={buttonStyle(editor.isActive("bold"))}><Bold size={16} /></button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleItalic().run())} style={buttonStyle(editor.isActive("italic"))}><Italic size={16} /></button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleUnderline().run())} style={buttonStyle(editor.isActive("underline"))}><UnderlineIcon size={16} /></button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleBulletList().run())} style={buttonStyle(editor.isActive("bulletList"))}><List size={16} /></button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleOrderedList().run())} style={buttonStyle(editor.isActive("orderedList"))}><ListOrdered size={16} /></button>

        {/* Headings */}
        <button type="button" onClick={safe(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} style={buttonStyle(editor.isActive("heading", { level: 1 }))}>H1</button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} style={buttonStyle(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={safe(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} style={buttonStyle(editor.isActive("heading", { level: 3 }))}>H3</button>
      </div>

      {/* Editor */}
      <div className={containerStyles.textareaContainer}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}