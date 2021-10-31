import { Prisma } from '@prisma/client';
import validator from 'validator';
import camelCase from 'lodash/camelCase';

import { Pagination } from '../services/types';
import { ValidatorError } from '../utils/errors';

export interface Query {
  limit?: string;
  page?: string;
  sorting?: string;
}

export const getListQueries = <T extends string>(query: Query, allowedOrderBy: string[]) => {
  let pagination: Pagination = {};
  let sorting: Partial<Record<T, Prisma.SortOrder>> = {};

  if (query.page) {
    if (validator.isInt(query.page?.toString() ?? '', { min: 1 })) {
      pagination.page = parseInt(query.page?.toString() ?? '', 10);
    } else {
      throw new ValidatorError(`the page is invalid`);
    }
  }
  if (query.limit) {
    if (validator.isInt(query.limit?.toString() ?? '', { min: 1 })) {
      pagination.limit = Math.min(parseInt(query.limit?.toString() ?? '', 10), 100);
    } else {
      throw new ValidatorError(`the limit is invalid`);
    }
  }
  if (query.sorting) {
    if (typeof query.sorting === 'string' && query.sorting.split('.').length === 2) {
      if (allowedOrderBy.includes(query.sorting.split('.')[0])) {
        if (['asc', 'desc'].includes(query.sorting.split('.')[1].toLowerCase())) {
          const [field, order] = query.sorting.split('.') as [T, Prisma.SortOrder];
          sorting[camelCase(field) as T] = order.toLowerCase() as Prisma.SortOrder;
        } else {
          throw new ValidatorError(`Sorting is not valid. Use asc or desc as direction`);
        }
      } else {
        throw new ValidatorError(
          `Sorting is not valid. Only those ${allowedOrderBy.join(', ')} fields are allowed. ex`
        );
      }
    } else {
      throw new ValidatorError(`Sorting is not valid. Ex: ${allowedOrderBy[0]}.asc`);
    }
  }

  return {
    pagination,
    sorting,
  };
};
