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
            number: true,
            motive: true,
            description: true,
            demandant: true,
            demanded: true,
            admin_data: true,
            collaborators: true,
            status: true,
            date_last_performance: true,
        },
    });

    return data;
  })