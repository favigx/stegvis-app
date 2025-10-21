import { type JSX, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from "lucide-react";
import styles from "./RichTextEditorToolbar.module.css";

interface RichTextEditorToolbarProps {
  editor: Editor | null;
}

export function RichTextEditorToolbar({ editor }: RichTextEditorToolbarProps) {
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      setBoldActive(editor.isActive("bold"));
      setItalicActive(editor.isActive("italic"));
      setUnderlineActive(editor.isActive("underline"));
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);

  const toggleMark = (mark: "bold" | "italic" | "underline") => {
    if (!editor) return;
    switch (mark) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        setBoldActive(!boldActive);
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        setItalicActive(!italicActive);
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        setUnderlineActive(!underlineActive);
        break;
    }
  };

  const IconButton = ({
    onClick,
    children,
    selected = false,
  }: {
    onClick: () => void;
    children: JSX.Element | string;
    selected?: boolean;
  }) => (
    <button
      className={`${styles.iconButton} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className={styles.toolbarContainer}>
      {/* Text formatting */}
      <IconButton onClick={() => toggleMark("bold")} selected={boldActive}>
        <Bold size={16} />
      </IconButton>
      <IconButton onClick={() => toggleMark("italic")} selected={italicActive}>
        <Italic size={16} />
      </IconButton>
      <IconButton onClick={() => toggleMark("underline")} selected={underlineActive}>
        <UnderlineIcon size={16} />
      </IconButton>

      {/* Lists */}
      <IconButton onClick={() => editor?.chain().focus().toggleBulletList().run()} selected={editor?.isActive("bulletList")}>
        <List size={16} />
      </IconButton>
      <IconButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} selected={editor?.isActive("orderedList")}>
        <ListOrdered size={16} />
      </IconButton>

      {/* H2 only as Header */}
      <IconButton
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        selected={editor?.isActive("heading", { level: 2 })}
      >
        Header
      </IconButton>
    </div>
  );
}
