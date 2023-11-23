import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    
    const data = await prisma.cases.findMany({
        select: {
            id: true,
            number: true,
            motive: true,
            description: true,
            demandant: true,
            demanded: true,
            performances: true,
            admin_data: true,
            status: true,
        }
    });
    return data;
})