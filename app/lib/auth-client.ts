import { createAuthClient } from "better-auth/client";

// 动态确定 baseURL
const baseURL
  = typeof window === "undefined"
    // eslint-disable-next-line node/prefer-global/process
    ? process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000/api/auth"
    : `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({
  baseURL,
});
