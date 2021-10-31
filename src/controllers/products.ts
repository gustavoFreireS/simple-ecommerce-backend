import { Request, Response, Router } from 'express';
import validator from 'validator';
import {
  getProducts,
  countProducts,
  getProduct,
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

async function get(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    if (!validator.isUUID(req.params.id)) {
      throw new ValidatorError('Invalid id');
    }

    const data = await getProduct(id);

    res.json({
      data,
    });
  } catch (error) {
    if (error instanceof ValidatorError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(404).json({
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
router.get('/:id', get);

export default router;
