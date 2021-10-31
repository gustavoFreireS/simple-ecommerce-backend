import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthenticationError } from './errors';
import db from '../db';

const { SECRET_KEY } = process.env;
export const APP_SECRET = SECRET_KEY || 'secret';

interface Token {
  user: {
    id: string;
    email: string;
  };
}

export async function getUserId(req: Request<any, any, any, any>): Promise<string> {
  const Authorization = req.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as Token;
    const userId = verifiedToken && verifiedToken.user.id;
    if (userId) {
      const data = await db.user.findUnique({ where: { id: userId } });

      if (!data) {
        throw new AuthenticationError('#1 must authenticate');
      }
      return userId;
    } else {
      throw new AuthenticationError('#2 must authenticate');
    }
  }
  throw new AuthenticationError('#3 must authenticate');
}
