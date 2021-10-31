import { Router } from 'express';

import auth from './controllers/auth';
import orders from './controllers/orders';
import products from './controllers/products';

const router = Router();

router.use('/auth', auth);
router.use('/products', products);
router.use('/orders', orders);

export { router };
