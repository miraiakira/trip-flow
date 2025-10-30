import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  // 显式把 id 转为 number
  event.context.user = session?.user
    ? {
        ...session.user,
        id: Number(session.user.id),
      }
    : undefined;

  // 如果访问 /dashboard 并且未登录或 id 非数字则重定向
  if (event.path.startsWith("/dashboard")) {
    if (!event.context.user || !Number.isFinite(event.context.user.id)) {
      sendRedirect(event, "/", 302);
    }
  }
});
