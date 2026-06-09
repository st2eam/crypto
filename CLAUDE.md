# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server (Vite HMR)
bun run build    # Type-check then build for production
bun run lint     # Run ESLint
bun run preview  # Preview production build locally
```

The build outputs to `docs/` (configured in vite.config.ts), which is deployed via GitHub Pages at `/crypto/`. The `@/` import alias resolves to `src/`.

## Architecture

This is a browser-side AES encryption/decryption utility. Users type plaintext or paste encrypted text, and the app auto-detects which direction to process based on a **prefix marker** (stored in localStorage, default `"@@@"`).

**Store layer** (`src/store/`) — React Context providers holding shared state:
- `SingletonProvider` — owns `value` (displayed plaintext), `source` (raw input), and exposes `encrypt`/`decrypt` wrappers around `crypto-js` AES
- `SecretProvider` — owns the secret key; persists reads/writes to `localStorage` via `src/utils/prefixUtil.ts`

**Hooks layer** (`src/hooks/`) — thin `useContext` wrappers (`useSingleton`, `useSecret`) that components consume

**App component** (`src/App/index.tsx`) — the single main view with two `contentEditable` divs (input and output). Key logic:
1. On input change, checks if decrypted input starts with the current prefix → if yes, it's ciphertext (decrypt it); if no, it's plaintext (encrypt it with `prefix + source`)
2. The "switch" button copies the output value into the input area (re-encrypt after editing)
3. Copy button writes both `text/html` and `text/plain` to the clipboard

**Setting component** (`src/components/Setting.tsx`) — a MUI Drawer with a TextField for editing the secret key (the prefix marker)

**Interface** (`src/interface/index.ts`) — TypeScript interfaces `ISingleton` and `ISecret` defining the context shapes

**Packages**: MUI v6 for UI, `crypto-js` for AES, `styled-components` + `emotion` for styling, Less for CSS modules, Bun as the package manager.
