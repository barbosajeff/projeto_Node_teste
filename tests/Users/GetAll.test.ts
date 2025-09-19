import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Users  -  Get All' , () => {

    it('Consultar todos os registros de User', async () => {

        const res1 = await testServer
            .get('/users/getAll')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});