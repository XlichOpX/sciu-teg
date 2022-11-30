// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const permissions = await prisma.permission.findMany({ select: { id: true } })
  await prisma.role.create({
    data: {
      name: 'Administrador',
      description: 'Dios',
      permissions: {
        connect: permissions
      }
    }
  })
  res.json({ success: true })
}
