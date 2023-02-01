import { beforeAll, describe, expect, it } from "vitest";
import { Task } from "../../entities/task.entity";
import { User } from "../../entities/user.entity";
import { InMemoryTaskRepository } from "../../repositories/in-memory/in-memory-task.repository";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-user.repository";
import { FindAllTaskUseCase } from "./find-all-task.usecase";

describe('Create Task Use Case', () => {
  const manager = new User({ name: 'Manager 01', type: 'manager' });
  const tech01 = new User({ name: 'Tech 01', type: 'technician' });
  const userRepository = new InMemoryUserRepository();

  beforeAll(async () => {
    await userRepository.create(manager);
    await userRepository.create(tech01);
  });

  it('should be able to find all tasks', async () => {
    const repository = new InMemoryTaskRepository();
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));
    repository.create(new Task({ summary: 'Summary 02', createdAt: new Date(), userId: tech01.id! }));
    const response = await new FindAllTaskUseCase(repository, userRepository).execute(manager.id!);

    expect(response.length).toEqual(2);
  });

  it('should throw an error when a non existent user try to find all tasks', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new FindAllTaskUseCase(repository, userRepository);

    expect(usecase.execute(-1)).rejects.toThrowError('AuthUserNotFound');
  })

  it('should throw an error when a technician try to find all tasks', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new FindAllTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!)).rejects.toThrowError('FindAllTaskOnlyManagerOperation');
  });
});