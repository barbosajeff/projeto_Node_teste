import { Request, Response } from "express";
import { prisma } from "./../../../index";
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';



interface IParamProps {
    id?:number;
}

export const getBiIdValidation = validation ({

    params: yup.object ({
        page: yup.number().integer().required().moreThan(0),

    })
   
});

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // busca o usuário pelo id, incluindo salary
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        salary: true, // inclui o salary caso exista
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};