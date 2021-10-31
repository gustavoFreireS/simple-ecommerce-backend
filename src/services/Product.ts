import db, { Prisma } from '../db';
import { Pagination } from './types';

export const productAllowedOrderBy = ['price', 'quantity', 'name'];

export type ProductOrderByWithRelationInput = Pick<
  Prisma.ProductOrderByWithRelationInput,
  'price' | 'quantity' | 'name'
>;

export const getProducts = async ({
  sorting,
  pagination: { limit: take = 25, page = 1 } = {},
}: {
  sorting?: ProductOrderByWithRelationInput;
  pagination?: Pagination;
} = {}) => {
  const skip = take * (page - 1);

  return await db.product.findMany({
    take,
    skip,
    orderBy: sorting,
  });
};

export const countProducts = async () => {
  return await db.product.count();
};
