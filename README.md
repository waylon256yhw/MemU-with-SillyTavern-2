# MemU for SillyTavern

This repository bundles the SillyTavern client extension and the server plugin required to talk to the [MemU](https://memu.pro) memory service. Install both pieces inside an existing SillyTavern deployment to enable automatic conversation summarisation, categorized memory storage, and prompt injection.

```
SillyTavern UI ©¤©¤ MemU Extension (React) ©¤©¤ SillyTavern Plugin (Express) ©¤©¤ MemU Cloud/API
        ¡ø                ¡ø                         ¡ø                             ¡ø
        ©¦ 1. chat events ©¦                         ©¦                             ©¦
        ©¦ 2. prompt prep ©¦                         ©¦                             ©¦
        ©¸©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤©¤ inject summaries ?©¤©¤©¤©¤©¤©¤©¤©¤©Ø©¤©¤ proxy /api/plugins/memu ?©¤©¤©¤©¼
```

## Repository Layout

- `memu-sillytavern-extension/` ¨C React application injected into SillyTavern?s front-end settings panel. Handles UI, local configuration and the logic that decides when to send chats to MemU.
- `memu-sillytavern-plugin/` ¨C Node/Express plugin packaged for SillyTavern?s backend. Forwards HTTPS requests to the official `memu-js` SDK and returns task results to the browser.

## Main Features

- **Configurable cadence**: `First summary floor` decides how many messages a new chat must accumulate before the first memorisation; `Summary interval` controls the gap between subsequent runs.
- **Manual trigger**: the _Summarize now_ button immediately submits the current dialogue and resets the interval counter.
- **Prompt injection**: retrieved MemU summaries either replace SillyTavern?s system summary or prepend a new `system` message when ¡°Override Summarizer¡± is enabled.
- **Background polling**: a timer watches task status, retries failed submissions, and fetches memory categories once MemU signals `SUCCESS`.
- **Per-chat state**: API key and cadence settings live in `localStorage`; chat-specific metadata is stored under `chatMetadata.memuExtras`, so switching characters keeps distinct memory files.

## Implementation Notes

- The extension debounces summary checks with SillyTavern?s built-in `debounce` helper to avoid flooding MemU when multiple chat events fire rapidly.
- `prepareConversationData()` serialises `st.getContext().chat` into the role/name format that `memu-js` expects. Insert your own sanitiser here if you need to strip UI-only markup before MemU sees it.
- The backend plugin exposes `/api/plugins/memu/getTaskStatus`, `/getTaskSummaryReady`, `/retrieveDefaultCategories`, and `/memorizeConversation`. Each route validates input, instantiates `MemuClient`, and pipes the response back to the browser.
- Both packages compile with TypeScript + webpack. Run `npm install` followed by `npm run build` inside each folder after copying them into SillyTavern.

## Installation (summary)

1. Copy `memu-sillytavern-extension/` to `public/scripts/extensions/third-party/` in your SillyTavern installation and run `npm install && npm run build` there.
2. Copy `memu-sillytavern-plugin/` to `server/plugins/third-party/` (or `server/plugins/memu/`), run `npm install && npm run build`, then restart SillyTavern.
3. Enable both the extension and the plugin in SillyTavern, enter a MemU API key, and configure the desired summarisation floors.
4. Open the browser DevTools console to monitor `memu-ext:` logs, and watch the SillyTavern server terminal for `[Memu-SillyTavern-Plugin]` messages during testing.

## Known Limitations / Next Steps

- **Message sanitisation**: MemU currently receives the raw SillyTavern chat log. Add a filter in `prepareConversationData()` if you need to remove formatting tags or UI hints.
- **Status feedback**: Failures are logged to the console only. Displaying task state (queued / running / failed) in the settings drawer would improve UX.
- **Error reporting**: The Express proxy returns HTTP errors but the UI just retries. Surface the actual message (e.g. invalid API key) for faster debugging.
- **Build ergonomics**: webpack resolves `@silly-tavern/*` aliases relative to a real SillyTavern tree. Build the extension from within a SillyTavern checkout or adjust the resolver if you want standalone builds.

For more detailed developer notes, see the documentation inside each subfolder.
