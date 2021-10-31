import { Request, Response, Router } from 'express';

import {
  getProducts,
  countProducts,
  productAllowedOrderBy,
  ProductOrderByWithRelationInput,
} from '../services/Product';
import { ValidatorError } from '../utils/errors';
import { getListQueries, Query } from '../utils/getListQueries';

const router = Router();

async function list(req: Request<{}, {}, {}, Query>, res: Response) {
  try {
    const { pagination, sorting } = getListQueries<keyof ProductOrderByWithRelationInput>(
      req.query,
      productAllowedOrderBy
    );

    const data = await getProducts({ pagination, sorting });

    const totalItems = await countProducts();

    res.json({
      data,
      pagination: {
        limit: pagination.limit ?? 25,
        page: pagination.page ?? 25,
        totalItems,
        totalPages: Math.ceil(totalItems / (pagination.limit ?? 25)),
      },
    });
  } catch (error) {
    if (error instanceof ValidatorError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const errorMessage = error instanceof Error ? error.message : error;
    res.status(500).json({
      error: errorMessage,
    });
  }
}

router.get('/', list);

export default router;
