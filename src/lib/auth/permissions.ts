import "server-only";
import { getSessionUser } from "./session";

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireSeller() {
  const user = await requireUser();

  if (user.role !== "seller") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
