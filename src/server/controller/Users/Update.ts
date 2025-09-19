import { Request, Response } from "express";
import { prisma } from './../../../server/shared/services/prisma';
import * as yup from 'yup';



interface IParamProps {
    id?:number;
}

interface ISalaryUpdate {
  amount?: number;
  currency?: string;
  position?: string;
}

interface IUsuarioUpdate {
  nome?: string;
  email?: string;
  role?: "USER" | "ADMIN";
  salary?: ISalaryUpdate;
}



export const updateUser = async (
  req: Request<{ id: string }, {}, IUsuarioUpdate>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nome, email, role, salary } = req.body;

    // verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { salary: true },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Atualiza os dados básicos do usuário
      const user = await tx.user.update({
        where: { id: Number(id) },
        data: {
          name: nome,
          email,
          role,
        },
      });

      if (salary) {
        if (existingUser.salary) {
          // Atualiza salário existente
          await tx.salary.update({
            where: { userId: Number(id) },
            data: {
              amount: salary.amount!,
              currency: salary.currency!,
              position: salary.position!,
            },
          });

          // Fecha o histórico atual
          await tx.salaryHistory.updateMany({
            where: { userId: Number(id), isCurrent: true },
            data: { effectiveTo: new Date(), isCurrent: false },
          });

          // Cria novo histórico
          await tx.salaryHistory.create({
            data: {
              userId: Number(id),
              amount: salary.amount!,
              currency: salary.currency!,
              position: salary.position!,
              effectiveFrom: new Date(),
              isCurrent: true,
            },
          });
        } else {
          // Cria novo salário
          await tx.salary.create({
            data: {
              userId: Number(id),
              amount: salary.amount!,
              currency: salary.currency!,
              position: salary.position!,
            },
          });

          // Cria histórico inicial
          await tx.salaryHistory.create({
            data: {
              userId: Number(id),
              amount: salary.amount!,
              currency: salary.currency!,
              position: salary.position!,
              effectiveFrom: new Date(),
              isCurrent: true,
            },
          });
        }
      }

      // Retorna usuário atualizado com salário atual
      return tx.user.findUnique({
        where: { id: Number(id) },
        include: { salary: true },
      });
    });

    return res.json(updatedUser);
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email já está em uso" });
    }

    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};