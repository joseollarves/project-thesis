import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;

    const data = await prisma.cases.findFirst({
        where: {
            id: id
        },
        select: {
            id: true,
            number: true,
            motive: true,
            description: true,
            collaborators: true,
            demandant: true,
            demanded: true,
            admin_data: true,
            status: true,
        }
    });

    return data;
  })