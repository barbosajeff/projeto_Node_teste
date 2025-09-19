import { StatusCodes } from "http-status-codes";
import { prisma } from './../../../server/shared/services/prisma';
import { Request,  Response } from "express";
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';


interface ISalary {
  amount: number;
  currency: string;
  position: string;
}


interface IParamProps {
    id?:number;
}

export const getBiIdValidation = validation ({

    params: yup.object ({
        id: yup.number().integer().required().moreThan(0),

    })
   
});

export const getSalary = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const salary = await prisma.salary.findUnique({
      where: { userId: Number(id) },
      select: {
        amount: true,
        currency: true,
        position: true,
      },
    });

    if (!salary) {
      return res.status(404).json({ error: "Salário não encontrado" });
    }

    // força o tipo ISalary no retorno
    const salaryResponse: ISalary = {
      amount: salary.amount,
      currency: salary.currency,
      position: salary.position,
    };

    return res.json(salaryResponse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar salário" });
  }
};
