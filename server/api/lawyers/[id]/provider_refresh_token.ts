import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;

    const data = await prisma.lawyers.findFirst({
        where: {
            id: id
        },
        select: {
            provider_refresh_token: true,
        }
    });

    return data;
  })