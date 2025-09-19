import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Salary  -  Delete ' , () => {

    it('Deletar um registro de Salary', async () => {

        const res1 = await testServer
            .delete('/salary/26')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});