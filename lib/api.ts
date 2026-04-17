/**
 * lib/api.ts — Re-export gateway
 *
 * TypeScript resolves `@/lib/api` to THIS file (not lib/api/index.ts)
 * because a .ts file takes priority over a directory index.
 *
 * This file simply re-exports everything from the new API layer so that
 * all existing imports (`import { ... } from "@/lib/api"`) continue to work.
 *
 * Do NOT add logic here — put it in lib/api/{auth,requests,...}.ts
 */

export * from "./api/index";
