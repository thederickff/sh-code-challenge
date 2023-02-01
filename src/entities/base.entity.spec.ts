import { expect, test } from 'vitest';
import { Entity } from './base.entity';
import { Task } from './task.entity';

test('create an entity', () => {
  const entity = new Entity();

  expect(entity).toBeInstanceOf(Entity);
  expect(entity.id).toEqual(undefined);
  entity.id = 10;
  expect(entity.id).toEqual(10);
});