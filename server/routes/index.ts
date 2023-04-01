import { Request, Response, Router } from 'express';
import api from './api';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('this is the index route');
});

router.use('/api', api);

// 404 route
router.all('*', (req: Request, res: Response) => {
    const errormsg = {
        message: 'You are hitting a wrong route, find the valid routes below',
        endpoints: {
            login: 'POST /api/auth/login',
        },
        success: false,
    };

    res.status(404).json(errormsg);
});

export default router;
