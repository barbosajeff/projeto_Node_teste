import { Request, Response } from "express";
import { prisma } from "../../../index";
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';



interface IParamProps {
    id?:number;
}

export const deleteValidation = validation ({

    params: yup.object ({
        page: yup.number().integer().required().moreThan(0),

    })
   
});

export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { salary: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Remove usuário (salary será removido em cascata se configurado no Prisma)
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover usuário" });
  }
};