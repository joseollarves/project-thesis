import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.task_id;
    
    const data = await prisma.tasks.findFirst({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            in_charge: true,
            status: true,
        },
    });

    return data;
  })