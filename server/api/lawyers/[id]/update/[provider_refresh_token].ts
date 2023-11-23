import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    const provider_refresh_token = event.context.params?.provider_refresh_token;
    
    const updateUser = await prisma.lawyers.update({
        where: {
            id: id,
        },
        data: {
            provider_refresh_token: provider_refresh_token
        },
    });

    return updateUser;
  })