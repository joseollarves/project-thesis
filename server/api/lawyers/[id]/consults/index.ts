import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    
    const data = await prisma.consults.findMany({
        where: {
            lawyer_id: id,
            status: null,
        },
        select: {
            id: true,
            user_name: true,
            user_email: true,
            modality: true,
            description: true,
            starts: true,
            ends: true,
            status: true,
            location: true,
            lawyer_id: true,
        },
    });

    return data;
  })