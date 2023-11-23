import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;

    const data = await prisma.lawyers.findMany({
        where: {
            NOT: {
                id: id
            }
        },
        select: {
            id: true,
            email: true,
            name: true,
            description: true,
            specializations: true,
            provider_refresh_token: true,
        }
    });

    return data;
  })