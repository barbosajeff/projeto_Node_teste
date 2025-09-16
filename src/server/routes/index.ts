import { Router } from 'express';
import { StatusCodes} from 'http-status-codes'


const router =   Router ();


//Router de teste 
router.get('/', (_, res) => {
  return res.send('ola Dev');
});


//Router de teste 
router.get(
    '/teste',
    (req, res) => {

        console.log(req.body) ;
        return res.status(StatusCodes.UNAUTHORIZED).json(req.body)
});










export {router};
