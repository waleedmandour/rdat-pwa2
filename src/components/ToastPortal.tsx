"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useToastStore, ToastType } from "@/stores/toast-store";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  success: "border-primary/40 bg-primary-muted/90 text-primary",
  error: "border-error/40 bg-error-bg/90 text-error",
  info: "border-accent/40 bg-accent/10 text-accent",
  warning: "border-warning/40 bg-warning-bg/90 text-warning",
};

function ToastItem({ toast }: { toast: { id: string; message: string; type: ToastType } }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const Icon = iconMap[toast.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm",
        "animate-in slide-in-from-right-full fade-in duration-300",
        "max-w-sm w-full",
        colorMap[toast.type]
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5 opacity-60" />
      </button>
    </div>
  );
}

export function ToastPortal() {
  const toasts = useToastStore((s) => s.toasts);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>,
    document.body
  );
}
