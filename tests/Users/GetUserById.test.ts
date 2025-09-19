import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Users  -  GetById ' , () => {

    it('Consultar um registro de User', async () => {

        const res1 = await testServer
            .get('/users/18')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});