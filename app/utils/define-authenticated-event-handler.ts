import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "~/lib/auth";

type AthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler<T>(handler: (event: AthenticatedEvent) => T) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }
    return handler(event as AthenticatedEvent);
  });
}
