"use client";

import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useRAG } from "@/hooks/useRAG";
import { getLTE } from "@/lib/local-translation-engine";
import { Search, X, BookOpen, ArrowRight, Note } from "lucide-react";

interface GlossaryPanelProps {
  open: boolean;
  onClose: () => void;
  sourceText?: string;
}

export function GlossaryPanel({ open, onClose, sourceText = "" }: GlossaryPanelProps) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const { lteSearch } = useRAG();
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-extract terms from current source line
  const autoTerms = useMemo(() => {
    if (!sourceText.trim()) return [];
    const lte = getLTE();
    const words = sourceText.split(/\s+/).filter((w) => w.length > 3);
    const uniqueWords = [...new Set(words)];
    const matches: Array<{ en: string; ar: string; score: number }> = [];

    for (const word of uniqueWords.slice(0, 20)) {
      const results = lte.search(word, 2);
      for (const r of results) {
        if (r.score > 0.3 && !matches.some((m) => m.en === r.en)) {
          matches.push({ en: r.en, ar: r.ar, score: r.score });
        }
      }
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [sourceText]);

  // Manual search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return lteSearch(searchTerm, 10);
  }, [searchTerm, lteSearch]);

  const displayedTerms = searchTerm.trim() ? searchResults : autoTerms;

  // Contextual notes for the current source
  const contextualNotes = useMemo(() => {
    const notes: string[] = [];
    if (sourceText.toLowerCase().includes("cat")) {
      notes.push(
        isRTL
          ? "احتفظ بـ \"CAT\" كاختصار مع ذكر المعنى العربي بين قوسين عند أول ورود"
          : "Maintain \"CAT\" as acronym with Arabic meaning in parentheses after first mention"
      );
    }
    if (sourceText.toLowerCase().includes("neural")) {
      notes.push(
        isRTL
          ? "\"العصبية\" تشير إلى الشبكات العصبية - استخدم السياق لتحديد الترجمة المناسبة"
          : "\"Neural\" refers to neural networks — use context to determine appropriate translation"
      );
    }
    return notes;
  }, [sourceText, isRTL]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "w-80 border-l border-border bg-surface flex flex-col h-full",
        locale === "ar" ? "border-l-0 border-r" : ""
      )}
      dir={isRTL ? "rtl" : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface-hover/30">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isRTL ? "المسرد" : "Glossary"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRTL ? "ابحث في المسرد..." : "Search Glossary..."}
            className={cn(
              "w-full bg-background border border-border/50 rounded-lg pl-9 pr-3 py-2",
              "text-xs text-foreground placeholder:text-muted-foreground/30",
              "focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40"
            )}
          />
        </div>
      </div>

      {/* Matched Terminology */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {isRTL ? "المصطلحات المتطابقة" : "Matched Terminology"}
        </h3>

        {displayedTerms.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-6 h-6 mx-auto text-muted-foreground/20 mb-2" />
            <p className="text-[11px] text-muted-foreground/50">
              {isRTL
                ? "لا توجد مصطلحات متطابقة. اكتب نصاً للبحث."
                : "No matching terms. Type to search."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedTerms.map((entry, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-background/60 border border-border/30 hover:border-primary/20 transition-colors"
              >
                <div className="text-xs font-medium text-foreground mb-0.5 truncate">
                  {entry.en}
                </div>
                <div className="text-xs text-primary/80 truncate" dir="rtl">
                  {entry.ar}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contextual Notes */}
      {contextualNotes.length > 0 && (
        <div className="border-t border-border px-3 py-2.5">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Note className="w-3 h-3" />
            {isRTL ? "ملاحظات سياقية" : "Contextual Notes"}
          </h3>
          <div className="space-y-1">
            {contextualNotes.map((note, i) => (
              <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                {note}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
