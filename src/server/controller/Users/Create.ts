import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "./../../../index";
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









// Controller create com salary opcional
export const create = async (req: Request<{}, {}, IUsuario>, res: Response) => {
  try {
    const { nome, email, role, salary } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name: nome,
        email,
        role: role ?? "USER",
        salary: salary
          ? {
              create: {
                amount: salary.amount,
                currency: salary.currency,
                position: salary.position,
              },
            }
          : undefined,
      },
      include: {
        salary: true, // retorna o salary junto
      },
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