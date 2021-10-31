import { Router } from 'express';

import auth from './controllers/auth';
import products from './controllers/products';

const router = Router();

router.use('/auth', auth);
router.use('/products', products);

export { router };
