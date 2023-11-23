import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

    const data = await prisma.lawyers.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            description: true,
            specializations: true,
            profile_picture: true,
        }
    });

    return data;
  })