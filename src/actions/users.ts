"use server";
import { db } from "@/lib/db";
import { gerUserId } from "./roadmaps";


export const decrementCreditsByUserId = async () => {
    const userId = (await gerUserId()) as string;
    try {
        // Retrieve the current user's credits
        const user = await db.user.findUnique({
            where: {
                id: userId,
            }
        });

        // Check if user exists and has more than 0 credits
        if (user && user.credits > 0) {
            await db.user.update({
                where: {
                    id: userId,
                },
                data: {
                    credits: {
                        decrement: 1 // use a positive number to indicate decrement
                    }
                }
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