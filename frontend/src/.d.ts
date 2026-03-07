/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMeta {
    env: Record<string, unknown>;
  }
}