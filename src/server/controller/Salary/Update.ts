import { prisma } from './../../../server/shared/services/prisma';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validation } from "../../shared/middlewares";
import * as yup from 'yup';

interface ISalary {
  amount: number;
  currency: string;
  position: string;
}


const salaryValidation = yup.object({
  amount: yup
    .number().typeError('O campo deve ser numerico')
    .positive('O salário deve ser maior que zero')
    .required('O campo é obrigatório'),
  currency: yup
    .string()
    .required('O campo é obrigatório')
    .length(3,'"A moeda deve ter exatamente 3 caracteres (ex: BRL, USD)'),
  position: yup
    .string()
    .required('O campo é obrigatório')
    .min(2,'A posição deve ter pelo menos 2 caracteres'),
});

export const updateSalary = async (
  req: Request<{ id: string }, {}, ISalary>,
  res: Response
) => {
  const { id } = req.params;
  const { amount, currency, position } = req.body;

  // Verifica se o usuário existe
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Usuário não encontrado" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Verifica se já existe salário
      const existingSalary = await tx.salary.findUnique({
        where: { userId: Number(id) },
      });

      if (!existingSalary) {
        // Caso não exista salário -> cria salário e histórico inicial
        const salary = await tx.salary.create({
          data: { amount, currency, position, userId: Number(id) },
        });

        await tx.salaryHistory.create({
          data: {
            userId: Number(id),
            amount,
            currency,
            position,
            effectiveFrom: new Date(),
            isCurrent: true,
          },
        });

        return salary;
      }

      // Atualiza o salário atual
      const updatedSalary = await tx.salary.update({
        where: { userId: Number(id) },
        data: { amount, currency, position },
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
          amount,
          currency,
          position,
          effectiveFrom: new Date(),
          isCurrent: true,
        },
      });

      return updatedSalary;
    });

    return res.status(StatusCodes.ACCEPTED).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao atualizar salário" });
  }
};