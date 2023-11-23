import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    
    const data = await prisma.cases.findMany({
        where: {
            status: true,
        },
        select: {
            motive: true,
            description: true,
            admin_data: true,
            date_last_performance: true,
        }
    });
    return data;
})