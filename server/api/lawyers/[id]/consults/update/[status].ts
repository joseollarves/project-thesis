import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    const consult = event.context.params?.consult;
    
    const updateStatus = await prisma.consults.create({
        data: {
            
        },
    });

    return updateStatus;
  })