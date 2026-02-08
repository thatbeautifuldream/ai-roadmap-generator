"use server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { getUserId } from "./roadmaps";

export const decrementCreditsByUserId = async () => {
  const userId = await getUserId();
  if (!userId) return false;

  try {
    // Retrieve the current user's credits
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // Check if user exists and has more than 0 credits
    if (user && user.credits > 0) {
      await db
        .update(users)
        .set({
          credits: sql`${users.credits} - 1`,
        })
        .where(eq(users.id, userId));
      return true;
    }
    // Either user does not exist or does not have enough credits to decrement
    return false;
  } catch (e) {
    // Handle the error, optionally log it or throw it
    console.error(e);
    return false;
  }
};

export const userHasCredits = async () => {
  const userId = await getUserId();
  if (!userId) return false;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      credits: true,
    },
  });

  if (user && user.credits > 0) {
    return true;
  }
  return false;
};

export const getUserCredits = async () => {
  const userId = await getUserId();

  if (!userId) {
    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      credits: true,
    },
  });

  return user?.credits;
};

export const getTotalUsers = async () => {
  const [{ value: totalUsers }] = await db
    .select({ value: count() })
    .from(users);
  return totalUsers;
};
