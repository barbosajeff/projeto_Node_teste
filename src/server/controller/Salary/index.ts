import * as updateSalary from './Update';
import * as deleteSalaty from './Delete';
import * as getSalary from './GetById';


export const SalaryController = {
    ...updateSalary,
    ...deleteSalaty,
    ...getSalary,
}