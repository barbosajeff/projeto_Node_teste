import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Salary  -  Update ' , () => {

    it('atualizar  um registro de Salary', async () => {

        const res1 = await testServer
            .put('/salary/18')
            .send({
               
                amount: 6500,
                currency: 'BRL',
                position: 'Developer'
                   
            });

        expect(res1.statusCode).toEqual(StatusCodes.ACCEPTED);


    });


});