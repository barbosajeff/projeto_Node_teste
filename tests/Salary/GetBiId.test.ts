import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Salary -  GetById ' , () => {

    it('Consultar um registro de Salary ', async () => {

        const res1 = await testServer
            .get('/salary/18')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});