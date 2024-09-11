/// <reference path="../.astro/types.d.ts" />

// env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DB_NAME : string;
  readonly DB_PASSWORD : string; // Only accessible server-side
  readonly DB_USER:string;
  readonly DB_HOST:string;
  readonly DB_PORT:number;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

