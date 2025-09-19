import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Users  -  Update ' , () => {

    it('atualizar  um registro de User', async () => {

        const res1 = await testServer
            .put('/users/18')
            .send({
                nome: 'jeff barbosa s',
                email: 'teste1testetetet23sasad@emaail.com',
                role: 'USER',
                salary: {
                    amount: 6000,
                    currency: 'BRL',
                    position: 'Developer'
                }    
            });

        expect(res1.statusCode).toEqual(StatusCodes.OK);


    });


});