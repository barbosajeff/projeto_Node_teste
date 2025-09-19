"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controller_1 = require("./../controller");
const router = (0, express_1.Router)();
exports.router = router;
//Router de teste 
router.get('/', (_, res) => {
    return res.send('ola Dev');
});
/**
 * Routes de Usuario
 */
router.post('/users/', controller_1.UsersController.createValidation, controller_1.UsersController.create);
router.get('/users/getAll', controller_1.UsersController.listUsersValidation, controller_1.UsersController.listUsers);
router.get('/users/:id', controller_1.UsersController.getBiIdValidation, controller_1.UsersController.getUserById);
router.put('/users/:id', controller_1.UsersController.updateUser);
router.delete('/users/:id', controller_1.UsersController.deleteValidation, controller_1.UsersController.deleteUser);
/**
 * Routes de Salario
 */
router.put('/salary/:id', controller_1.SalaryController.updateSalary);
router.delete('/salary/:id', controller_1.SalaryController.deleteValidation, controller_1.SalaryController.deleteSalaty);
router.get('/salary/:id', controller_1.SalaryController.getBiIdValidation, controller_1.SalaryController.getSalary);
/**Router de Historico de Salarios */
router.get('/salaryHistoric/:id', controller_1.HistoricSalaryController.getSalarys);
