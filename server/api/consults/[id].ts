import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    
    const data = await prisma.consults.findMany({
        where: {
            id: id,
        },
        select: {
            id: true,
            lawyer_id: true,
            user_email: true,
        },
    });

    return data;
  })