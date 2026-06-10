"use client";

import React, { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useToastStore } from "@/stores/toast-store";
import { FileUp, FileText } from "lucide-react";
import * as mammoth from "mammoth";

interface DragDropImporterProps {
  onTextImport: (text: string, fileName: string) => void;
  children: React.ReactNode;
}

export function DragDropImporter({ onTextImport, children }: DragDropImporterProps) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const addToast = useToastStore((s) => s.addToast);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const processFile = useCallback(
    async (file: File) => {
      try {
        let text = "";

        if (file.name.endsWith(".docx")) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          text = result.value;
        } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          text = await file.text();
        } else {
          addToast(
            isRTL
              ? `صيغة الملف غير مدعومة: ${file.name}`
              : `Unsupported file format: ${file.name}`,
            "warning"
          );
          return;
        }

        if (text.trim()) {
          onTextImport(text, file.name);
          addToast(
            isRTL
              ? `تم استيراد ${file.name} بنجاح`
              : `Successfully imported ${file.name}`,
            "success"
          );
        } else {
          addToast(
            isRTL ? "الملف فارغ" : "The file is empty",
            "warning"
          );
        }
      } catch (err) {
        console.error("[DragDrop] File read failed:", err);
        addToast(
          isRTL
            ? `فشل في قراءة الملف: ${file.name}`
            : `Failed to read file: ${file.name}`,
          "error"
        );
      }
    },
    [onTextImport, isRTL, addToast]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await processFile(file);
      }
    },
    [processFile]
  );

  return (
    <div
      className="relative h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm border-2 border-dashed border-primary/50 rounded-lg">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <FileUp className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isRTL ? "أفلت الملف هنا" : "Drop file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isRTL ? "يدعم .txt, .docx, .md" : "Supports .txt, .docx, .md"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
