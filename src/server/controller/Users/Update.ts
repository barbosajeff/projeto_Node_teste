import { Request, Response } from "express";
import { prisma } from "../../../index";
import * as yup from 'yup';
import { validation } from "../../shared/middlewares";


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


export const updateUserValidation = validation( {
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
    params: yup.object ({
            page: yup.number().integer().required().moreThan(0),
    
        }),
});


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

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: nome,
        email,
        role,
        salary: salary
          ? existingUser.salary
            ? {
                update: {
                  amount: salary.amount,
                  currency: salary.currency,
                  position: salary.position,
                },
              }
            : {
                create: {
                  amount: salary.amount!,
                  currency: salary.currency!,
                  position: salary.position!,
                },
              }
          : undefined,
      },
      include: { salary: true },
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