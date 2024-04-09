const { PrismaClient } = require("@prisma/client");
const { clerkClient } = require("@clerk/nextjs");

const prisma = new PrismaClient();

async function updateImageUrls() {
  const dbUsers = await clerkClient.users.getUserList();

  try {
    for (const dbUser of dbUsers) {
      if (dbUser.imageUrl) {
        await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            imageUrl: dbUser.imageUrl,
          },
        });
      }
    }

    console.log("Image URLs updated successfully.");
  } catch (error) {
    console.error("Error updating image URLs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  await updateImageUrls();
})();
