"use server";
import { db } from "@/lib/db";
import { getUserId } from "./roadmaps";

export const decrementCreditsByUserId = async () => {
  const userId = await getUserId();
  try {
    // Retrieve the current user's credits
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Check if user exists and has more than 0 credits
    if (user && user.credits > 0) {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            decrement: 1, // use a positive number to indicate decrement
          },
        },
      });
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
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
    },
  });

  if (user && user?.credits > 0) {
    return true;
  }
  return false;
};

export const getUserCredits = async () => {
  const userId = await getUserId();

  if (!userId) {
    return;
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
    },
  });

  return user?.credits;
};
