import { expect, test } from 'vitest';
import { Task } from './task.entity';

test('create a task', () => {
  const task = new Task({
    summary: 'The task summary',
    createdAt: new Date(),
    userId: 1
  });

  expect(task).toBeInstanceOf(Task);
  expect(task.summary).toEqual('The task summary');
  expect(task.userId).toEqual(1);
});