"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useToastStore } from "@/stores/toast-store";
import { Copy, FileText, Upload, AlignLeft } from "lucide-react";
import * as mammoth from "mammoth";

interface SourceToolbarProps {
  sourceText: string;
  onTextChange: (text: string) => void;
}

export function SourceToolbar({ sourceText, onTextChange }: SourceToolbarProps) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sourceText);
      addToast(
        isRTL ? "تم نسخ النص المصدر" : "Source text copied to clipboard",
        "success",
        2000
      );
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = sourceText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      addToast(
        isRTL ? "تم نسخ النص المصدر" : "Source text copied to clipboard",
        "success",
        2000
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onTextChange(result.value);
        addToast(
          isRTL
            ? `تم استيراد ${file.name} بنجاح`
            : `Successfully imported ${file.name}`,
          "success"
        );
      } else {
        const text = await file.text();
        onTextChange(text);
        addToast(
          isRTL
            ? `تم استيراد ${file.name} بنجاح`
            : `Successfully imported ${file.name}`,
          "success"
        );
      }
    } catch (err) {
      console.error("[SourceToolbar] File read failed:", err);
      addToast(
        isRTL
          ? `فشل في قراءة الملف: ${file.name}`
          : `Failed to read file: ${file.name}`,
        "error"
      );
    }

    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-surface border-b border-border">
      <button
        onClick={handleCopy}
        disabled={!sourceText.trim()}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors",
          sourceText.trim()
            ? "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
            : "text-muted-foreground/30 cursor-not-allowed"
        )}
        title={isRTL ? "نسخ النص" : "Copy text"}
      >
        <Copy className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isRTL ? "نسخ" : "Copy"}</span>
      </button>

      <div className="w-px h-4 bg-border/50 mx-1" />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
        title={isRTL ? "فتح ملف (.txt, .docx)" : "Open file (.txt, .docx)"}
      >
        <Upload className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isRTL ? "فتح ملف" : "Open File"}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.docx,.md"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex-1" />

      {/* Source indicator */}
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
        <AlignLeft className="w-3 h-3" />
        <span>EN-US</span>
      </div>
    </div>
  );
}
