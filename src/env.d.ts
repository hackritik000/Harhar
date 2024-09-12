/// <reference path="../.astro/types.d.ts" />

// env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DB_NAME: string;
  readonly DB_PASSWORD: string;
  readonly DB_USER: string;
  readonly DB_HOST: string;
  readonly DB_PORT: number;

  readonly PRODUCTION: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
}
