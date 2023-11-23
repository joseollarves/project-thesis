import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    
    const data = await prisma.cases.findMany({
        where: {
            collaborators: {
                has: id,
            },
        },
        select: {
            id: true,
            motive: true,
            description: true,
            collaborators: true,
            date_last_performance: true,
            status: true,
        },
    });

    return data;
  })