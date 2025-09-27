import { faker } from '@faker-js/faker';
import type { User, Card, Transaction } from '../types';

const createMockUser = (): User => {
  const mainAccountBalance = faker.number.int({ min: 10000, max: 250000 });

  const cards: Card[] = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
    const type = faker.helpers.arrayElement<'pointage' | 'epargne' | 'offrant'>(['pointage', 'epargne', 'offrant']);
    const balance = faker.number.int({ min: 5000, max: 100000 });
    let goal: number;
    let boxAmount: number | undefined;
    let boxesFilled: number | undefined;

    if (type === 'pointage') {
      boxAmount = faker.helpers.arrayElement([1000, 2000, 5000]);
      boxesFilled = faker.number.int({ min: 5, max: 28 });
      goal = boxAmount * 30;
    } else {
      goal = balance + faker.number.int({ min: 20000, max: 100000 });
    }

    return {
      id: faker.string.uuid(),
      type,
      name: `${faker.commerce.productAdjective()} ${type}`,
      status: 'active',
      createdAt: faker.date.past({ years: 1 }),
      balance,
      goal,
      boxAmount,
      boxesFilled,
      transactions: [],
    };
  });

  const transactions: Transaction[] = Array.from({ length: faker.number.int({min: 5, max: 15})}, () => ({
     id: faker.string.uuid(),
     type: faker.helpers.arrayElement(['deposit_main', 'deposit_card', 'withdraw_card']),
     status: 'completed',
     amount: faker.number.int({min: 1000, max: 50000}),
     date: faker.date.recent({days: 90}),
     description: faker.finance.transactionDescription(),
  }));

  return {
    id: 'user-123',
    name: 'Don Réel',
    phone: '+242 06 480 14 69',
    pin: '1234',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    createdAt: faker.date.past({ years: 1 }),
    mainAccountBalance,
    cards,
    transactions,
  };
};

export const mockUser = createMockUser();
