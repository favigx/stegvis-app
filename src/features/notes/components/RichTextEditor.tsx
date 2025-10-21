import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Gapcursor from "@tiptap/extension-gapcursor";
import Placeholder from "@tiptap/extension-placeholder";
import styles from "./RichTextEditor.module.css";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";

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
     Placeholder.configure({
  placeholder: 'Börja skriv ny anteckning',
  showOnlyWhenEditable: true,
  includeChildren: true,
  emptyNodeClass: 'placeholder', // Lägg till klass om du vill styla
}),
    ],
    content,
    editorProps: {
      attributes: {
        class: `ProseMirror ${styles.textarea}`,
        style: "outline: none; box-shadow: none;",
      },
    },
    autofocus: "start",
    onUpdate: ({ editor }) => {
      if (settingContentRef.current) {
        settingContentRef.current = false;
        return;
      }
      const html = editor.getHTML();
      if (html !== lastHtmlRef.current) {
        lastHtmlRef.current = html;
        onChange?.(html);
      }
    },
  });

  return (
    <div className={styles.editorWrapper}>
      <RichTextEditorToolbar editor={editor} />
      <div className={styles.textareaContainer}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
