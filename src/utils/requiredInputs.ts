import { ValidatorError } from './errors';

export const requiredInputs = <T extends { [key: string]: any }>(data: T, fields: string[]) => {
  const missFields = fields.filter((field) => typeof data[field] === 'undefined');

  if (missFields.length) {
    throw new ValidatorError(
      `The ${missFields.join(', ')} ${missFields.length === 1 ? 'is' : 'are'} required`
    );
  }
};
