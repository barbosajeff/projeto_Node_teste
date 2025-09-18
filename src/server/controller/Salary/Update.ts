import { prisma } from "../../../index";
import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';






interface ISalary {
  amount: number;
  currency: string;
  position: string;
}



const salaryValidation  =  yup.object ({

    amount : yup
        .number().typeError('O campo deve ser numerico')
        .positive('O salário deve ser maior que zero')
        .required('O campo é obrigatório'),
    currency : yup
        .string()
        .required('O campo é obrigatório')
        .length(3,'"A moeda deve ter exatamente 3 caracteres (ex: BRL, USD)'),
    position : yup
        .string()
        .required('O campo é obrigatório')
        .min(2,'A posição deve ter pelo menos 2 caracteres'),
});


export const updateSalaryValidation : RequestHandler = async (req, res, next) =>{

    try {
        
        await salaryValidation.validate (req.body, {abortEarly: false});
        return next();


    } catch (error) {
        
        if (error instanceof yup.ValidationError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                 errors : error.errors
            });
        }

        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao salvar salário" });

    }

};


export const updateSalary =  async ( req: Request<{id : string}, {}, ISalary>, res:Response) => {

    const { id } = req.params;
    const { amount, currency, position } = req.body;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Usuário não encontrado" });
    }

    // Cria ou atualiza salário (1:1)
    const salary = await prisma.salary.upsert({
      where: { userId: Number(id) },
      update: { amount, currency, position },
      create: { amount, currency, position, userId: Number(id) },
    });

    return res.status(StatusCodes.ACCEPTED).json(salary);

};



