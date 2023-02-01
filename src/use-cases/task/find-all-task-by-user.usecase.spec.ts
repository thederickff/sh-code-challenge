import { beforeAll, describe, expect, it } from "vitest";
import { Task } from "../../entities/task.entity";
import { User } from "../../entities/user.entity";
import { InMemoryTaskRepository } from "../../repositories/in-memory/in-memory-task.repository";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-user.repository";
import { FindAllByUserTaskUseCase } from "./find-all-task-by-user.usecase";

describe('Create Task Use Case', () => {
  const manager = new User({ name: 'Manager 01', type: 'manager' });
  const tech01 = new User({ name: 'Tech 01', type: 'technician' });
  const tech02 = new User({ name: 'Tech 02', type: 'technician' });
  const userRepository = new InMemoryUserRepository();

  beforeAll(async () => {
    await userRepository.create(manager);
    await userRepository.create(tech01);
    await userRepository.create(tech02);
  });

  it('should be able to find all tasks by user id', async () => {
    const repository = new InMemoryTaskRepository();
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));
    repository.create(new Task({ summary: 'Summary 02', createdAt: new Date(), userId: tech02.id! }));
    repository.create(new Task({ summary: 'Summary 03', createdAt: new Date(), userId: tech01.id! }));
    const usecase = new FindAllByUserTaskUseCase(repository, userRepository)
    const response = await usecase.execute(tech02.id!, { userId: tech02.id! });

    expect(response.length).toEqual(1);
    expect(response[0].summary).toEqual('Summary 02');
    await usecase.execute(manager.id!, { userId: tech02.id! });
  });

  it('should throw an error when a non existent authUser try to find all tasks by user', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new FindAllByUserTaskUseCase(repository, userRepository);
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));

    expect(usecase.execute(-1, {
      userId: tech01.id!
    })).rejects.toThrowError('AuthUserNotFound');
  })

  it('should throw an error when a non manager authUser try to find all tasks from another user', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new FindAllByUserTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!, {
      userId: tech02.id!
    })).rejects.toThrowError('FindAllTaskByUserOnlyManagerOperation');
  })
});