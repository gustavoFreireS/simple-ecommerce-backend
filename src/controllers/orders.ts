import { Request, Response, Router } from 'express';
import { Prisma, Order } from '@prisma/client';
import validator from 'validator';

import {
  createOrder,
  getOrder,
  countOrders,
  orderAllowedOrderBy,
  getOrders,
  OrderOrderByWithRelationInput,
} from '../services/Order';
import { ValidatorError, AuthenticationError } from '../utils/errors';
import { getUserId } from '../utils/getUserId';
import { getListQueries, Query } from '../utils/getListQueries';

const router = Router();

const create = async (
  req: Request<{}, { data: Order }, { data_scheduled?: string }>,
  res: Response
) => {
  try {
    const userId = await getUserId(req);

    const data: Prisma.OrderCreateInput = {
      user: { connect: { id: userId } },
    };
    if (req.body.data_scheduled) {
      data.dataScheduled = req.body.data_scheduled;
    }
    const entity = await createOrder(data);

    res.json({ data: entity });
  } catch (error) {
    if (error instanceof ValidatorError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.message,
      });
    }
    const errorMessage = error instanceof Error ? error.message : error;
    res.status(500).json({
      error: errorMessage,
    });
  }
};

async function list(req: Request<{}, {}, {}, Query>, res: Response) {
  try {
    const { pagination, sorting } = getListQueries<keyof OrderOrderByWithRelationInput>(
      req.query,
      orderAllowedOrderBy
    );
    const userId = await getUserId(req);

    const data = await getOrders({ pagination, sorting, where: { userId } });

    const totalItems = await countOrders({
      where: {
        userId,
      },
    });

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

    const userId = await getUserId(req);

    const data = await getOrder(id);

    if (data.userId !== userId) {
      throw new Error('Not Found Error');
    }

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

router.post('/', create);
router.get('/', list);
router.get('/:id', get);

export default router;
