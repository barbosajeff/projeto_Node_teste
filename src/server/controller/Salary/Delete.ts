import { StatusCodes } from "http-status-codes";
import { prisma } from './../../../server/shared/services/prisma';
import { Request,  Response } from "express";
import { validation } from '../../shared/middlewares';
import * as yup from 'yup';



interface IParamProps {
    id?:number;
}

export const deleteValidation = validation ({

    params: yup.object ({
        id: yup.number().integer().required().moreThan(0),

    })
   
});


export const deleteSalaty =  async (req:Request<{id:string}>, res: Response) => {

    try {

        const {id} = req.params;

        const salary =  await prisma.salary.findUnique({
            where : {userId : Number(id)},
        });

        if (!salary) {
            return res.status(StatusCodes.NOT_FOUND).json({error : 'Salário não encontrado'});
        }
        

        await prisma.salary.delete ({
            where: { userId: Number(id) },
        });

        return res.json({ message: "Salário removido com sucesso" });

    } catch (error){
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao remover salário" });
    }

} ;
