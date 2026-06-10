# RDAT Copilot: AI-Powered Translation Co-Writing IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![WebGPU](https://img.shields.io/badge/AI-WebGPU-purple)](https://www.w3.org/TR/webgpu/)
[![PWA](https://img.shields.io/badge/PWA-Offline%20First-green)](https://web.dev/progressive-web-apps/)
[![DOI](https://img.shields.io/badge/DOI-10.17605%2FOSF.IO%2FGAQ4K-blue)](https://doi.org/10.17605/OSF.IO/GAQ4K)

A state-of-the-art, **offline-capable** Computer-Assisted Translation (CAT) tool built as a Progressive Web App. RDAT Copilot operates exactly like an AI Code Copilot (e.g., GitHub Copilot), but for **English to Arabic** professional translation.

> **OSF Project Archive:** [https://osf.io/gaq4k/](https://osf.io/gaq4k/)

---

## Key Features

- **IDE-Grade Interface** — Professional dark-themed split-pane Monaco Editor mirroring VS Code with native RTL support for Arabic text
- **Multi-Channel AI Ghost Text** — 5-channel cascade: LTE (instant) → Prefetch Cache → RAG (semantic) → WebLLM (local GPU) → Gemini (cloud)
- **Inline Glossary Search** — Right-side panel with real-time terminology lookup, matched entries from the corpus, and contextual translation notes
- **AI Translation Tutor** — Chat-based AI assistant that evaluates translations, suggests improvements, explains cultural nuances, and checks terminology accuracy
- **Drag & Drop Import** — Drop `.txt`, `.docx`, or `.md` files directly onto the source pane for instant import with intelligent parsing
- **Non-Blocking Toast Notifications** — Aesthetic, auto-dismissing toast portal replaces all `alert()`/`confirm()` calls with contextual feedback
- **Flow Transitions** — Smooth CSS animations for view changes, panel slides, and component mount/unmount transitions
- **Offline-First PWA** — Fully functional without internet after initial load; local AI inference via WebGPU
- **Native RTL** — Monaco Editor with true `direction: rtl` binding (no CSS hacks)
- **Copilot UX** — Ghost text completions, `Ctrl+Right` word-by-word accept, `Tab` commit, `Alt+]` cycle alternatives
- **RAG-Powered** — Vector database (Orama) + BGE-M3 embeddings for contextually relevant translation suggestions
- **Privacy-First** — All AI processing happens in-browser; no data leaves your machine unless you opt into cloud fallback
- **Full Bilingual UI** — Complete English/Arabic interface with RTL layout switching and Noto Sans Arabic typography

---

## Architecture: The 5-Channel Translation Engine

RDAT Copilot uses a cascading multi-channel architecture that delivers instant suggestions while progressively higher-quality results arrive in the background:

```
┌──────────────────────────────────────────────────────────────────┐
│                   Ghost Text Provider (Monaco)                    │
│                                                                   │
│  0ms ───────▶  Channel 0: LTE (Local Translation Engine)         │
│                 • Synchronous, <5ms                               │
│                 • Exact → Partial → N-gram matching               │
│                 • Smart Remainder prefix completion               │
│                                                                   │
│  0ms ───────▶  Channel 3: Prefetch Cache                          │
│                 • requestIdleCallback queued translations         │
│                 • Lines N+1, N+2 translated in background         │
│                                                                   │
│  800ms ──────▶ Channel 1: WebLLM (WebGPU)                         │
│                 • gemma-2b-it-q4f32_1-MLC                        │
│                 • CreateWebWorkerMLCEngine (off-thread)           │
│                 • 3-5 word burst continuation                     │
│                                                                   │
│  800ms ──────▶ Channel 2: Gemini (Cloud Fallback)                 │
│                 • gemini-2.0-flash via REST API                   │
│                 • Activated when WebGPU unavailable               │
│                                                                   │
│  1200ms ─────▶ Full Sentence Completion                           │
│                 • Best available engine generates complete line   │
└──────────────────────────────────────────────────────────────────┘
```

### Channel Details

| Channel | Engine | Latency | Quality | Offline? |
|---------|--------|---------|---------|----------|
| **0** | LTE (Phrase Table) | <5ms | Good (exact matches) | Yes |
| **1** | WebLLM (WebGPU) | 800ms+ | Excellent (neural) | Yes* |
| **2** | Gemini (Cloud) | 800ms+ | Excellent (neural) | No |
| **3** | Prefetch Cache | <1ms | Good (cached) | Yes |
| **4** | RAG (Vector DB) | 50-200ms | Very Good (contextual) | Yes* |

*\*Requires initial model download during first session.*

---

## New Features in v1.1

### Inline Glossary Search Panel
A collapsible right-side panel that provides real-time terminology lookup as you translate. It automatically extracts terms from the current source line and matches them against the loaded corpus, displaying both English and Arabic equivalents with confidence scores. A contextual notes section provides domain-specific guidance (e.g., keeping "CAT" as an acronym with the Arabic meaning in parentheses).

### AI Translation Tutor
A chat-based AI assistant accessible via the header toolbar. The tutor can:
- **Evaluate** your translation quality (accuracy, fluency, cultural appropriateness)
- **Suggest improvements** with detailed explanations
- **Explain cultural nuances** between English and Arabic expressions
- **Check terminology** consistency against the loaded glossary

The tutor uses the Gemini API (requires API key) and sends the current translation context for relevant, contextual feedback.

### Drag & Drop File Import
Drop `.txt`, `.docx`, or `.md` files directly onto the source editor pane. The file is parsed automatically (using mammoth for .docx), and the content replaces the source text. Visual feedback includes a drag overlay with file format indicators and toast notifications for success/failure.

### Toast Notification Portal
A non-blocking, auto-dismissing notification system that replaces all `alert()` and `confirm()` calls. Four toast types (success, error, info, warning) appear in the top-right corner with icons, messages, and manual dismiss buttons. All toolbar actions (copy, export, import, clear) now use toast feedback.

### Flow Transitions
Smooth CSS keyframe animations for view changes, panel slides, and component mounting. The glossary and AI tutor panels slide in from the right, toast notifications slide up from the bottom, and view transitions use a subtle fade+translate effect.

---

## Quick Start

### Prerequisites
- **Node.js** 20+ and npm
- **Modern Browser** with WebGPU support (Chrome 113+, Edge 113+)

### Installation

```bash
# Clone the repository
git clone https://github.com/waleedmandour/rdat-pwa2.git
cd rdat-pwa2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

### PWA Installation
The app registers as a PWA automatically when served over HTTPS (or localhost). Install it via your browser's "Add to Home Screen" or "Install App" option for a native-like experience.

---

## Project Structure

```
rdat-pwa2/
├── public/
│   ├── data/
│   │   └── default-corpus-en-ar.json   # Default bilingual sentence pairs
│   ├── icons/                          # PWA icons (SVG + PNG)
│   ├── logo.svg                        # App logo
│   ├── manifest.json                   # PWA manifest
│   └── sw.js                           # Service Worker (generated)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout + LanguageProvider + ThemeProvider
│   │   ├── page.tsx                    # Entry point → WorkspaceShell
│   │   └── globals.css                 # Tailwind v4 + theme vars + flow transitions
│   ├── components/
│   │   ├── editors/
│   │   │   ├── SourceEditor.tsx        # English pane (LTR, read-only, Monaco)
│   │   │   ├── TargetEditor.tsx        # Arabic pane (RTL, ghost text, Monaco)
│   │   │   ├── SourceToolbar.tsx       # Copy + file upload (with toast)
│   │   │   ├── TargetToolbar.tsx       # Copy + export + clear (with toast)
│   │   │   ├── SegmentHighlighter.tsx  # Cross-pane line sync
│   │   │   └── TranslationWorkspace.tsx# Split-pane orchestrator + right panels
│   │   ├── AiTutorPanel.tsx            # AI Translation Tutor chat panel
│   │   ├── DragDropImporter.tsx        # Drag & drop file import wrapper
│   │   ├── GlossaryPanel.tsx           # Inline glossary search panel
│   │   ├── ToastPortal.tsx             # Non-blocking toast notifications
│   │   ├── Sidebar.tsx                 # Navigation explorer with logo
│   │   ├── StatusBar.tsx               # Dynamic AI state badges
│   │   ├── WorkspaceShell.tsx          # Main IDE layout + panel toggles
│   │   ├── WelcomeTab.tsx              # Bilingual welcome screen
│   │   ├── Settings.tsx                # API keys + model params
│   │   └── ...                         # Other views
│   ├── context/
│   │   └── LanguageContext.tsx         # EN/AR i18n context
│   ├── hooks/
│   │   ├── useRAG.ts                   # RAG worker hook
│   │   ├── useWebLLM.ts                # WebGPU engine hook
│   │   ├── useGemini.ts                # Gemini cloud hook
│   │   └── usePredictiveTranslation.ts # Idle prefetch hook
│   ├── i18n/
│   │   └── translations.ts             # Full EN/AR translation dicts
│   ├── lib/
│   │   ├── local-translation-engine.ts # Channel 0: LTE class
│   │   ├── monaco-suggestion-provider.ts# Multi-channel orchestrator
│   │   └── utils.ts                    # cn() utility
│   ├── stores/
│   │   ├── prefetch-store.ts           # Translation cache (Zustand)
│   │   ├── settings-store.ts           # User preferences (persisted)
│   │   └── toast-store.ts              # Toast notification state
│   └── workers/
│       └── rag-worker.ts               # Web Worker (Orama + Transformers.js)
├── next.config.mjs                     # Next.js + PWA + webpack config
├── CITATION.cff                        # Academic citation metadata
├── LICENSE                             # MIT License
└── README.md                           # This file
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Right Arrow` | Accept next word of ghost text |
| `Tab` | Accept full suggestion |
| `Esc` | Dismiss suggestion |
| `Alt + ]` | Cycle through suggestion alternatives |

---

## Internationalization

RDAT Copilot is fully bilingual (English / Arabic) with a built-in language toggle in the sidebar:

- **UI Labels** — All navigation, status badges, toast messages, and panel text translate dynamically
- **RTL Layout** — When Arabic is selected, the sidebar and status bar switch to `dir="rtl"` using native HTML direction
- **Font** — Noto Sans Arabic is loaded automatically for crisp Arabic rendering
- **Panels** — Glossary panel and AI Tutor support both languages

---

## Configuration

### Gemini API Key
1. Navigate to **Settings** in the sidebar
2. Paste your API key from [Google AI Studio](https://aistudio.google.com/apikey)
3. Enable "Use cloud fallback" to activate Gemini when WebGPU is unavailable
4. The API key is also required for the AI Translation Tutor

### WebGPU Requirements
- Chrome 113+ or Edge 113+
- GPU with WebGPU support (most modern GPUs)
- ~1.5GB download for the initial model (cached in browser)

---

## Citation

If you use this software in your research, teaching, or publications, please cite it as follows:

```bibtex
@software{mandour2026_rdat_copilot,
  author       = {Mandour, Waleed},
  title        = {{RDAT Copilot: AI-Powered Translation Co-Writing IDE}},
  year         = {2026},
  url          = {https://github.com/waleedmandour/rdat-pwa2},
  doi          = {10.17605/OSF.IO/GAQ4K},
  version      = {1.1.0},
  license      = {MIT},
  affiliation  = {Sultan Qaboos University}
}
```

Or use the **Cite this repository** button on GitHub (powered by `CITATION.cff`).

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Author

**Dr. Waleed Mandour**
Sultan Qaboos University
[w.abumandour@squ.edu.om](mailto:w.abumandour@squ.edu.om)

---

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — VS Code-grade editor component
- [MLC AI / WebLLM](https://github.com/mlc-ai/web-llm) — In-browser LLM inference
- [Transformers.js](https://huggingface.co/docs/transformers.js) — Client-side ML embeddings
- [Orama](https://docs.oramasearch.com/) — In-memory vector search
- [Next.js](https://nextjs.org/) — React framework with App Router
- [Zustand](https://github.com/pmndrs/zustand) — Lightweight state management
- [mammoth](https://github.com/mwilliamson/mammoth.js) — .docx parsing
- [Lucide Icons](https://lucide.dev/) — Beautiful open-source icons
