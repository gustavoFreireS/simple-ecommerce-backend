import { ValidatorError } from '../utils/errors';

export const passwordCheck = (password: string) => {
  if (password.length < 8) {
    throw new ValidatorError('The password needs to contain at least 8 length');
  }
  if (!/[0-9]+/.test(password)) {
    throw new ValidatorError('The password needs to contain at least 1 number');
  }
  if (!/[a-z]+/.test(password)) {
    throw new ValidatorError('The password needs to contain at least 1 lower case letter');
  }
  if (!/[A-Z]+/.test(password)) {
    throw new ValidatorError('The password needs to contain at least 1 upper case letter');
  }
  if (!/[\W]+/.test(password)) {
    throw new ValidatorError('The password needs to contain at least 1 upper case symbol');
  }
};
