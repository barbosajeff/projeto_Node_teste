import { StatusCodes } from "http-status-codes";
import { testServer } from "../jest.setup";


describe('Users  -  Create ' , () => {

    it('Criar um registro de User', async () => {

        const res1 = await testServer
            .post('/users/')
            .send({
                nome: 'jeff barbosa teste um',
                email: 'testeUm@emailTEste.com',
                role: 'USER',
                salary: {
                    amount: 51000,
                    currency: 'BRL',
                    position: 'Developer'
                }    
            });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);


    });


});