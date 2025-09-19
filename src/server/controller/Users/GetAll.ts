import { Request, Response } from 'express';
import { prisma } from '../../shared/services/prisma';
import { Prisma } from "@prisma/client";
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';

interface IQueryProps {
    page?:number;
    limit?:number;
    filter?: string;
}



export const listUsersValidation = validation ({

    query: yup.object ({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional(),
    })
   
});

export const listUsers = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", q, sort } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Filtro por nome ou email
    const where: Prisma.UserWhereInput | undefined = q
    ? {
        OR: [
            { name: { contains: q as string, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: q as string, mode: Prisma.QueryMode.insensitive } },
        ],
        }
    : undefined;

    // ↕️ Ordenação (?sort=name:asc ou ?sort=createdAt:desc)
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" }; // padrão
    if (sort) {
      const [field, direction] = (sort as string).split(":");
      if (field) {
        orderBy = {
          [field]: direction === "desc" ? "desc" : "asc",
        };
      }
    }

    // 📄 Consulta no banco
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      data: users,
      meta: {
        total,
        page: pageNum,
        lastPage: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};
