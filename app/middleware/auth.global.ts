import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return;

  if (to.path.startsWith("/dashboard")) {
    const { data, error } = await authClient.getSession();

    console.log("session", data?.session);

    if (!data?.user || error !== null) {
      return navigateTo("/");
    }
  }
});
