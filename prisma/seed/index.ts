import products from './products';

async function seed() {
  try {
    await products();
  } catch (error) {
    console.error(error);
  }
}

seed();
