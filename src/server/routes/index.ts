import { Router } from 'express';
import { StatusCodes} from 'http-status-codes';
import {UsersController, SalaryController, HistoricSalaryController} from  './../controller';


const router =   Router ();


//Router de teste 
router.get('/', (_, res) => {
  return res.send('ola Dev');
});

/**
 * Routes de Usuario
 */
router.post( '/users/',UsersController.createValidation, UsersController.create);
router.get('/users/getAll', UsersController.listUsersValidation, UsersController.listUsers );
router.get('/users/:id',UsersController.getUserById);
router.put('/users/:id', UsersController.updateUser);
router.delete('/users/:id', UsersController.deleteUser);


/**
 * Routes de Salario
 */
router.put('/salary/:id', SalaryController.updateSalary);
router.delete('/salary/:id', SalaryController.deleteSalaty);
router.get('/salary/:id', SalaryController.getSalary);

/**Router de Historico de Salarios */

router.get('/salaryHistoric/:id',HistoricSalaryController.getSalarys)


export {router};
