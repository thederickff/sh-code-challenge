import { expect, test } from 'vitest';
import { User } from './user.entity';

test('create an user', () => {
  const user = new User({
    name: 'User 01',
    type: 'manager'
  });

  expect(user).toBeInstanceOf(User);
  expect(user.name).toEqual('User 01');
  expect(user.type).toEqual('manager');
});