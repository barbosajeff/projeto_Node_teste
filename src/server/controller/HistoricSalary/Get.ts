import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../index";
import { Request, Response } from "express";

interface ISalary {
  amount: number;
  currency: string;
  position: string;
}

interface ISalaryHistory extends ISalary {
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  isCurrent: boolean;
}

interface ISalaryResponse {
  currentSalary: ISalary;
  history: ISalaryHistory[];
}

export const getSalarys = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Busca o salário atual
    const salary = await prisma.salary.findUnique({
      where: { userId: Number(id) },
      select: {
        amount: true,
        currency: true,
        position: true,
      },
    });

    if (!salary) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Salário não encontrado" });
    }

    // Busca todo o histórico de salários
    const history = await prisma.salaryHistory.findMany({
      where: { userId: Number(id) },
      orderBy: { effectiveFrom: 'desc' },
      select: {
        amount: true,
        currency: true,
        position: true,
        effectiveFrom: true,
        effectiveTo: true,
        isCurrent: true,
      },
    });

    const response: ISalaryResponse = {
      currentSalary: {
        amount: salary.amount,
        currency: salary.currency,
        position: salary.position,
      },
      history,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao buscar salário" });
  }
};