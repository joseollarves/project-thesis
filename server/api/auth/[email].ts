import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const email = event.context.params?.email;

  const data = await prisma.lawyers.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      description: true,
      email: true,
      specializations: true,
      profile_picture: true,
      is_admin: true,
      provider_refresh_token: true,
    },
  });
  
  return data;
});