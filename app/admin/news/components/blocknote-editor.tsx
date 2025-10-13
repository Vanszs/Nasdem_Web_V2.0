"use client";

import "@blocknote/core/fonts/inter.css";
import { useEffect, useRef, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { cn } from "@/lib/utils";

type BlockNoteEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const EMPTY_DOCUMENT_HTML = "<p><br /></p>";

function parseInitialContent(html: string | undefined) {
  if (!html) {
    return undefined;
  }

  try {
    const tempEditor = BlockNoteEditor.create();
    return tempEditor.tryParseHTMLToBlocks(html);
  } catch (error) {
    console.warn(
      "[BlockNoteEditor] Failed to parse initial HTML content.",
      error
    );
    return undefined;
  }
}

export function BlockNoteEditorField({
  value,
  onChange,
  placeholder = "Tulis konten...",
  disabled = false,
  className,
}: BlockNoteEditorProps) {
  const [initialContent] = useState(() => parseInitialContent(value));

  const editor = useCreateBlockNote(
    {
      initialContent,
    },
    []
  );

  const lastAppliedHtmlRef = useRef(value ?? "");

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextHtml = value ?? "";
    if (nextHtml === lastAppliedHtmlRef.current) {
      return;
    }

    try {
      const parsedBlocks = editor.tryParseHTMLToBlocks(
        nextHtml.trim().length > 0 ? nextHtml : EMPTY_DOCUMENT_HTML
      );
      editor.replaceBlocks(editor.document, parsedBlocks);
      lastAppliedHtmlRef.current = nextHtml;
    } catch (error) {
      console.warn(
        "[BlockNoteEditor] Failed to apply external HTML value.",
        error
      );
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const unsubscribe = editor.onChange((instance) => {
      const html = instance.blocksToFullHTML(instance.document);
      lastAppliedHtmlRef.current = html;
      onChange(html);
    });

    return unsubscribe;
  }, [editor, onChange]);

  if (!editor) {
    return null;
  }

  return (
    <BlockNoteView
      theme={"light"}
      editor={editor}
      editable={!disabled}
      className={cn(
        "rounded-xl bg-white placeholder:text-gray-400 shadow-sm border border-gray-200 p-4 transition-shadow focus-within:ring-2 focus-within:ring-brand-primary focus-within:ring-offset-2",
        className
      )}
    />
  );
}

export default BlockNoteEditorField;
