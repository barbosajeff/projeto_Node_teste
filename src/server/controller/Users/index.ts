import * as create from './Create';
import * as listUsers from  './ListUsers';
import * as getUserById from './GetUserById';
import * as updateUser from './Update' ;
import * as deleteUser from './Delete';


export const UsersController =  {
    ...create,
    ...listUsers,
    ...getUserById,
    ...updateUser,
    ...deleteUser,
};