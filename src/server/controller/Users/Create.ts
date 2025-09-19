import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from './../../../server/shared/services/prisma';
import * as yup from 'yup';
import { validation } from "../../shared/middlewares";


interface IUsuario {
  nome: string;
  email: string;
  role?: "USER" | "ADMIN"; // se quiser já colocar a role
  salary?: ISalary;   
}

interface ISalary {
  amount: number;
  currency: string;
  position: string;
}


export const createValidation = validation( {
    body : yup .object({
            nome: yup.string().required("O nome é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres"),
            email: yup.string().required("O email é obrigatório").email("Formato de email inválido"),
            role: yup.mixed<"USER" | "ADMIN">().oneOf(["USER", "ADMIN"]).default("USER").optional(),
            salary: yup.object({ 
                amount: yup.number().required("O valor do salário é obrigatório"),
                currency: yup.string().required("A moeda é obrigatória"),
                position: yup.string().required("O cargo é obrigatório"),
                }).optional(),
            })
            .strict()
            .noUnknown(true, "Campos não permitidos foram enviados"),
});









export const create = async (req: Request<{}, {}, IUsuario>, res: Response) => {
  try {
    const { nome, email, role, salary } = req.body;

    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Cria o usuário
      const user = await tx.user.create({
        data: {
          name: nome,
          email,
          role: role ?? "USER",
        },
      });

      // 2. Se salary foi enviado, cria Salary e SalaryHistory
      if (salary) {
        await tx.salary.create({
          data: {
            userId: user.id,
            amount: salary.amount!,
            currency: salary.currency!,
            position: salary.position!,
          },
        });

        await tx.salaryHistory.create({
          data: {
            userId: user.id,
            amount: salary.amount!,
            currency: salary.currency!,
            position: salary.position!,
            effectiveFrom: new Date(),
            isCurrent: true,
          },
        });
      }

      // 3. Retorna usuário criado com salário incluso (se houver)
      return tx.user.findUnique({
        where: { id: user.id },
        include: { salary: true },
      });
    });

    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email já está em uso" });
    }

    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
};