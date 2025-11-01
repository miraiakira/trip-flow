import type { DrizzleError } from "drizzle-orm";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const errorMessage = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ");

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join(".")] = issue.message;
      return errors;
    }, {} as Record<string, string>);
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: errorMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where: and(
      eq(location.userId, event.context.user.id),
      eq(location.name, result.data.name),
    ),
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location already exists",
    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id, // 这里是 number，不需要再转换
    }).returning();

    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    console.error("Insert Error: ", error.message);
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "db error",
    }));
  }
});
