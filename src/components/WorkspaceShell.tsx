"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NavItem } from "./Sidebar";
import { StatusBar, EngineMode, GTRStatus } from "./StatusBar";
import type { WebGPUInfo } from "./StatusBar";
import { WelcomeTab } from "./WelcomeTab";
import { TranslationWorkspace } from "./editors/TranslationWorkspace";
import { SettingsPanel } from "./Settings";
import { AiModelsView } from "./AiModelsView";
import { GlossaryView } from "./GlossaryView";
import { QuickGuideModal, hasSeenGuide } from "./QuickGuideModal";
import { InstallPWAButton } from "./InstallPWAButton";
import { ToastPortal } from "./ToastPortal";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { Sun, Moon, HelpCircle, BookOpen, Sparkles, RefreshCw } from "lucide-react";

interface WorkspaceShellProps {
  children?: React.ReactNode;
  className?: string;
}

export function WorkspaceShell({ children, className }: WorkspaceShellProps) {
  const { t, locale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeNav, setActiveNav] = useState<NavItem>("translator");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Right panel state
  const [glossaryPanelOpen, setGlossaryPanelOpen] = useState(false);
  const [aiTutorPanelOpen, setAiTutorPanelOpen] = useState(false);

  // AI engine state
  const [webgpuInfo, setWebgpuInfo] = useState<WebGPUInfo>({ state: "loading" });
  const [geminiAvailable, setGeminiAvailable] = useState(false);

  // Translation state for panels
  const [currentSource, setCurrentSource] = useState("");
  const [currentTarget, setCurrentTarget] = useState("");

  // Auto-open guide on first visit
  useEffect(() => {
    if (!hasSeenGuide()) {
      setShowGuide(true);
    }
  }, []);

  const isDark = theme === "dark";

  // Placeholder status props
  const engineMode: EngineMode = "hybrid";
  const gtrStatus: GTRStatus = "zero-shot";

  const navTitleMap: Record<NavItem, string> = {
    translator: t("workspace.title.translator"),
    glossary: t("workspace.title.glossary"),
    vectordb: t("workspace.title.vectordb"),
    models: t("workspace.title.models"),
    "api-keys": t("workspace.title.apiKeys"),
    settings: t("workspace.title.settings"),
  };

  // Render active view
  const renderView = () => {
    switch (activeNav) {
      case "translator":
        return (
          <TranslationWorkspace
            onWebgpuStateChange={setWebgpuInfo}
            onGeminiAvailableChange={setGeminiAvailable}
            onSourceChange={(val) => setCurrentSource(val ?? "")}
            onTargetChange={(val) => setCurrentTarget(val ?? "")}
            glossaryPanelOpen={glossaryPanelOpen}
            aiTutorPanelOpen={aiTutorPanelOpen}
            onGlossaryPanelClose={() => setGlossaryPanelOpen(false)}
            onAiTutorPanelClose={() => setAiTutorPanelOpen(false)}
            sourceText={currentSource}
            targetText={currentTarget}
          />
        );
      case "glossary":
        return <GlossaryView />;
      case "vectordb":
        return <GlossaryView />;
      case "models":
        return <AiModelsView />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <WelcomeTab />;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen w-screen overflow-hidden bg-background",
        className
      )}
      dir={locale === "ar" ? "rtl" : undefined}
    >
      {/* Main Content Area: Sidebar + Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Explorer) */}
        <Sidebar
          activeItem={activeNav}
          onNavItemChange={setActiveNav}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          onOpenGuide={() => setShowGuide(true)}
        />

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar (Title/Actions) */}
          <header className="h-10 bg-surface border-b border-border flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              {/* Logo + Back */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                  <img
                    src="/logo.svg"
                    alt="Copilot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-primary">Copilot</span>
              </div>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <span className="text-sm font-medium text-foreground">
                {navTitleMap[activeNav]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Sync Button */}
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
                title={locale === "en" ? "Sync" : "مزامنة"}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* PWA Install Button */}
              <InstallPWAButton />

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Help Button */}
              <button
                onClick={() => setShowGuide(true)}
                className="p-1.5 rounded-md hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors"
                title={locale === "en" ? "Quick Guide" : "دليل سريع"}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-border/50 mx-0.5" />

              {/* Glossary Panel Toggle */}
              <button
                onClick={() => {
                  setGlossaryPanelOpen(!glossaryPanelOpen);
                  if (aiTutorPanelOpen) setAiTutorPanelOpen(false);
                }}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  glossaryPanelOpen
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-surface-hover text-muted-foreground hover:text-foreground"
                )}
                title={locale === "en" ? "Glossary" : "المسرد"}
              >
                <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                {locale === "en" ? "Glossary" : "المسرد"}
              </button>

              {/* AI Tutor Panel Toggle */}
              <button
                onClick={() => {
                  setAiTutorPanelOpen(!aiTutorPanelOpen);
                  if (glossaryPanelOpen) setGlossaryPanelOpen(false);
                }}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  aiTutorPanelOpen
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-surface-hover text-muted-foreground hover:text-foreground"
                )}
                title={locale === "en" ? "AI Tutor" : "المعلم الذكي"}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                {locale === "en" ? "AI Tutor" : "معلم AI"}
              </button>

              {/* Ready Indicator */}
              <div className="flex items-center gap-1.5 ml-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  {locale === "en" ? "Online" : "متصل"}
                </span>
              </div>
            </div>
          </header>

          {/* Workspace Content */}
          <div className="flex-1 overflow-hidden bg-background">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        engineMode={engineMode}
        gtrStatus={gtrStatus}
        webgpuInfo={webgpuInfo}
        geminiAvailable={geminiAvailable}
        segmentCount={0}
        wordCount={0}
      />

      {/* Quick Guide Modal */}
      <QuickGuideModal open={showGuide} onClose={() => setShowGuide(false)} />

      {/* Toast Notification Portal */}
      <ToastPortal />
    </div>
  );
}
