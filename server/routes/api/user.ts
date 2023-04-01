import { Router } from 'express';
import { lnurlLogin, pseudoLogin } from '../../controllers';

const router = Router();

router.get('/login-lnurl', lnurlLogin);
router.get('/lnurl', pseudoLogin);

export default router;
