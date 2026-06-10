"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useSettingsStore } from "@/stores/settings-store";
import { useToastStore } from "@/stores/toast-store";
import { Send, Bot, User, Loader2, X, Sparkles } from "lucide-react";

interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AiTutorPanelProps {
  open: boolean;
  onClose: () => void;
  sourceText?: string;
  targetText?: string;
}

export function AiTutorPanel({ open, onClose, sourceText = "", targetText = "" }: AiTutorPanelProps) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const apiKey = useSettingsStore((s) => s.geminiApiKey);
  const addToast = useToastStore((s) => s.addToast);

  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Suggested prompts
  const suggestions = isRTL
    ? [
        "قيّم هذه الترجمة",
        "اقترح تحسينات",
        "اشرح الفروق الثقافية",
        "تحقق من المصطلحات",
      ]
    : [
        "Evaluate this translation",
        "Suggest improvements",
        "Explain cultural nuances",
        "Check terminology accuracy",
      ];

  const handleSend = useCallback(
    async (customMessage?: string) => {
      const userMessage = customMessage || input.trim();
      if (!userMessage) return;

      if (!apiKey?.trim()) {
        addToast(
          isRTL
            ? "يرجى إضافة مفتاح Gemini API في الإعدادات أولاً"
            : "Please add your Gemini API key in Settings first",
          "warning"
        );
        return;
      }

      // Add user message
      const userMsg: TutorMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsGenerating(true);

      // Build context with translation pair
      const systemPrompt = `You are an expert AI Translation Tutor specialized in English↔Arabic translation. You help translators improve their work by:
1. Evaluating translation quality (accuracy, fluency, cultural appropriateness)
2. Suggesting improvements with explanations
3. Explaining linguistic and cultural nuances
4. Checking terminology consistency
5. Providing alternative translations

Current translation context:
- Source (EN): ${sourceText.substring(0, 500)}
- Target (AR): ${targetText.substring(0, 500)}

Respond concisely and helpfully. Use both English and Arabic where appropriate.`;

      const conversationHistory = [...messages, userMsg]
        .map((m) => `${m.role === "user" ? "User" : "Tutor"}: ${m.content}`)
        .join("\n");

      try {
        abortRef.current = new AbortController();

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\n${conversationHistory}\n\nTutor:`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                maxOutputTokens: 512,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        const assistantMsg: TutorMessage = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: text,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          addToast(
            isRTL ? `خطأ في المعلم الذكي: ${err.message}` : `Tutor error: ${err.message}`,
            "error"
          );
        }
      } finally {
        setIsGenerating(false);
        abortRef.current = null;
      }
    },
    [input, apiKey, messages, sourceText, targetText, isRTL, addToast]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isRTL ? "المعلم الذكي" : "AI Tutor"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center py-4">
              {isRTL
                ? "اسأل عن الترجمة للحصول على تقييم واقتراحات"
                : "Ask about your translation for evaluation & suggestions"}
            </p>
            {/* Quick suggestion buttons */}
            <div className="space-y-1.5">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <Sparkles className="w-3 h-3 inline mr-1.5 text-primary/60" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed",
                msg.role === "user"
                  ? "bg-primary/15 text-foreground"
                  : "bg-background/80 text-foreground border border-border/30"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-accent" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="px-3 py-2 rounded-lg bg-background/80 border border-border/30">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-2">
        <div className="flex items-center gap-2 bg-background rounded-lg border border-border/50 px-2 py-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRTL ? "اسأل المعلم الذكي..." : "Ask the AI Tutor..."}
            disabled={isGenerating}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !input.trim()}
            className={cn(
              "p-1 rounded transition-colors",
              isGenerating || !input.trim()
                ? "text-muted-foreground/30 cursor-not-allowed"
                : "text-primary hover:bg-primary/10"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
