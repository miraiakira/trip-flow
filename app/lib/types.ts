import type { User } from "better-auth";
/* eslint-disable ts/consistent-type-definitions */
declare module "h3" {
  interface H3EventContext {
    user?: Omit<User, "id"> & { id: number };
  }
}
