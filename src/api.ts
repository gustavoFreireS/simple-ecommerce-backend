import { Router } from 'express';

const router = Router();

router.get('/auth/register', (req, res) => res.send('.'));

export { router };
