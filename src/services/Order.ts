import db, { Prisma } from '../db';
import { Pagination } from './types';

export const orderAllowedOrderBy = ['data_scheduled', 'created_at'];

export type OrderOrderByWithRelationInput = Pick<
  Prisma.OrderOrderByWithRelationInput,
  'dataScheduled' | 'createdAt'
>;

export const getOrders = async ({
  where,
  sorting,
  pagination: { limit: take = 25, page = 1 } = {},
}: {
  where: Prisma.OrderWhereInput & { userId: string };
  sorting?: OrderOrderByWithRelationInput;
  pagination?: Pagination;
}) => {
  const skip = take * (page - 1);

  return await db.order.findMany({
    take,
    skip,
    orderBy: sorting,
    where,
  });
};

export const countOrders = async ({
  where,
}: {
  where: Prisma.OrderWhereInput & { userId: string };
}) => {
  return await db.order.count({ where });
};

export const getOrder = async (id: string) => {
  return await db.order.findUnique({
    rejectOnNotFound: true,
    where: {
      id,
    },
  });
};

export const createOrder = async (data: Prisma.OrderCreateInput) => {
  return await db.order.create({
    data,
  });
};
