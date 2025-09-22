# MemU SillyTavern Integration

This repository packages the client-side extension and server plugin that bridge SillyTavern with the MemU memory service. It ships two deliverables:

- `memu-sillytavern-extension/` ¨C React UI and in-browser logic that runs inside SillyTavern¡¯s front-end.
- `memu-sillytavern-plugin/` ¨C Express plug-in that SillyTavern mounts on its backend to proxy API calls to `memu-js`.

## Architecture Overview

```
SillyTavern UI  ©¤©¤? MemU Extension (React) ©¤©¤? SillyTavern Backend Plugin ©¤©¤? MemU Cloud/API
      ©¦                     ©¦                         ©¦                         ©¦
      ©¦ 1. listens to chat  ©¦                         ©¦                         ©¦
      ©¦    events           ©¦                         ©¦                         ©¦
      ©¦                     ©¦ 2. batches conversation ©¦                         ©¦
      ©¦                     ©¦    & changing settings  ©¦                         ©¦
      ©¦                     ¨‹                         ¨‹                         ¨‹
  Prompt builder   ?©¤©¤ inject summary          Express routes proxy    MemU memory agent
```

1. **Front-end extension** registers listeners for chat events (`CHAT_CHANGED`, `CHARACTER_MESSAGE_RENDERED`, etc.), tracks message counts, and triggers memorization when thresholds are reached or when the user clicks *Summarize now*.
2. **Backend plugin** exposes `/api/plugins/memu/*` routes. Each handler validates the payload and forwards it to `memu-js`, the official SDK for MemU.
3. **MemU service** stores conversations, produces summaries per category, and returns them for injection into SillyTavern prompts.

## Key Features

- **Configurable summarization cadence** ¨C `First summary floor` decides how many messages must exist before the first memorization; `Summary interval` controls subsequent triggers.
- **Manual trigger** ¨C ¡°Summarize now¡± button immediately submits the current dialogue and resets the interval counter.
- **Prompt injection** ¨C Retrieved MemU summaries either replace SillyTavern¡¯s system summary or prepend a new system message, depending on the *Override Summarizer* toggle.
- **Background polling** ¨C A timer checks task status, handles retries, and pulls categorized memories when MemU marks a task as `SUCCESS`.
- **State persistence** ¨C API key, toggles, and summarization thresholds are stored in `localStorage`; chat-specific metadata lives in `chatMetadata.memuExtras` so switching characters keeps independent memory files.

## Implementation Notes

- The extension debounces summary checks via SillyTavern¡¯s built-in `debounce` helper to avoid hammering MemU when multiple chat events fire.
- `prepareConversationData()` serializes the in-memory chat into the role/name format required by MemU. Sanitization can be added here if you need to strip UI-only markup before it reaches MemU.
- The backend plugin consumes the same `memu-js` client that standalone integrations use; base URL and retries are configurable in `src/consts.ts`.
- Build pipeline: TypeScript + webpack output `dist/index.js` for both the extension (browser bundle) and the plugin (CommonJS module consumed by SillyTavern¡¯s server).

## Known Limitations & Potential Improvements

- **Raw message payloads** ¨C MemU currently receives the full SillyTavern chat log. If your frontend applies regex trimming or formatting, add an extra cleanup pass in `prepareConversationData()` so MemU stores sanitized text.
- **Task visibility** ¨C The UI only shows toast-style status through the developer console. Adding an explicit status indicator in the settings drawer would make monitoring easier.
- **Error handling** ¨C Failures are logged to the console and retried automatically, but exposing the error message in the UI (e.g., invalid API key) would improve UX.
- **Build ergonomics** ¨C The extension¡¯s webpack config expects to live inside a SillyTavern installation to resolve `@silly-tavern/*` aliases. If you build outside that tree, adjust the resolver or copy the compiled bundle from a SillyTavern instance.
- **Backend type hints** ¨C The server plugin relies on TypeScript definitions for Express and body-parser; ensure `@types/express` and `@types/body-parser` are installed when rebuilding.

## Getting Started

1. Copy `memu-sillytavern-extension/` into SillyTavern¡¯s `public/scripts/extensions/third-party/` directory.
2. Copy `memu-sillytavern-plugin/` into `server/plugins/third-party/` (or equivalent), run `npm install` and `npm run build` there.
3. Restart SillyTavern, enable the MemU plugin and extension in the UI, enter your MemU API key, and configure summarization floors as desired.
4. Watch the browser console (`memu-ext:` logs) and the SillyTavern server console (`[Memu-SillyTavern-Plugin]`) for diagnostics while testing.
