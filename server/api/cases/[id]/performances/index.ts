import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    
    const data = await prisma.performances.findMany({
        where: {
            case_id: id,
        },
        select: {
            id: true,
            created_at: true,
            name: true,
            date: true,
        },
    });

    return data;
  })