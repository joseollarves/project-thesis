import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.performance_id;
    
    const data = await prisma.performances.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            created_at: true,
            name: true,
            date: true,
            case_id: true,
        },
    });

    return data;
  })