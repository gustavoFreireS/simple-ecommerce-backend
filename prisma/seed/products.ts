import { PrismaClient } from '@prisma/client';
import faker from 'faker';

const prisma = new PrismaClient();

export default async () => {
  await prisma.product.createMany({
    data: [
      {
        name: faker.commerce.productName(),
        image_src: faker.image.animals(225, 300),
        price: faker.commerce.price(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      },
      {
        name: faker.commerce.productName(),
        image_src: faker.image.animals(225, 300),
        price: faker.commerce.price(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      },
      {
        name: faker.commerce.productName(),
        image_src: faker.image.animals(225, 300),
        price: faker.commerce.price(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      },
      {
        name: faker.commerce.productName(),
        image_src: faker.image.animals(225, 300),
        price: faker.commerce.price(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      },
      {
        name: faker.commerce.productName(),
        image_src: faker.image.animals(225, 300),
        price: faker.commerce.price(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
      },
    ],
  });
};
