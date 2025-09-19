import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Users  -  Delete ' , () => {

    it('Deletar um registro de User', async () => {

        const res1 = await testServer
            .delete('/users/26')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});