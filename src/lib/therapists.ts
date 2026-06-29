import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/db/prisma";

export async function getCurrentTherapist() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.therapist.findUnique({
    where: { clerkId: userId },
  });
  if (existing) return existing;

  try {
    return await prisma.therapist.create({
      data: { clerkId: userId },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return prisma.therapist.findUniqueOrThrow({
        where: { clerkId: userId },
      });
    }
    throw error;
  }
}

export async function requireCurrentTherapist() {
  const therapist = await getCurrentTherapist();
  if (!therapist) throw new Error("Unauthorized");
  return therapist;
}
