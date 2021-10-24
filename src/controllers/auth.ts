import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import omit from 'lodash/omit';

import { createUser, getUser } from '../services/User';
import { passwordCheck } from '../utils/passwordCheck';
import { ValidatorError, AuthenticationError } from '../utils/errors';
import { requiredInputs } from '../utils/requiredInputs';

const router = Router();

async function register(req: Request, res: Response) {
  const data = req.body;

  try {
    requiredInputs(data, ['email', 'password']);

    if (!validator.isEmail(data.email)) {
      throw new ValidatorError('Email needs to be valid');
    }

    const searchUser = await getUser({
      email: data.email,
    });

    if (searchUser) {
      throw new Error('The email has already been taken');
    }

    passwordCheck(data.password);

    const salt = bcrypt.genSaltSync(10);
    const password = await bcrypt.hash(data.password, salt);

    const user = await createUser({
      ...data,
      password,
    });
    res.json({ data: omit(user, ['password']) });
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

async function login(req: Request, res: Response) {
  const data = req.body;
  try {
    requiredInputs(data, ['email', 'password']);

    const user = await getUser({
      email: data.email,
    });

    if (!user) {
      throw new AuthenticationError('Password or/and Email invalid');
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new AuthenticationError('Password or/and Email invalid');
    }

    const token = await jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      process.env.SECRET_KEY as string
    );

    res.json({
      data: {
        token,
        user: omit(user, ['password']),
      },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(403).json({
        error: error.message,
      });
    }
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

router.post('/login', login);
router.post('/register', register);

export default router;
