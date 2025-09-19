import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Historic Salary  -  Get ' , () => {

    it('Consultar todos o hsitorico de salario de um User', async () => {

        const res1 = await testServer
            .get('/salaryHistoric/18')
           

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});