import db, { User, Prisma } from '../db';

type UserCreate = Pick<User, 'email' | 'password'>;

export const getUser = async (where: Prisma.UserWhereUniqueInput) => {
  return await db.user.findUnique({
    where,
  });
};

export const getFirstUser = async (where: Prisma.UserWhereInput) => {
  return await db.user.findFirst({
    where,
  });
};

export const createUser = async (data: UserCreate) => {
  return await db.user.create({
    data,
  });
};
