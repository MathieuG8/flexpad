/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly AUTH_SECRET?: string;
  readonly AUTH_TRUST_HOST?: string;
  readonly DATABASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}