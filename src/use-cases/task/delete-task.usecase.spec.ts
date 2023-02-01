import { beforeAll, describe, expect, it } from "vitest";
import { Task } from "../../entities/task.entity";
import { User } from "../../entities/user.entity";
import { InMemoryTaskRepository } from "../../repositories/in-memory/in-memory-task.repository";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-user.repository";
import { DeleteTaskUseCase } from "./delete-task.usecase";

describe('Create Task Use Case', () => {
  const manager = new User({ name: 'Manager 01', type: 'manager' });
  const tech01 = new User({ name: 'Tech 01', type: 'technician' });
  const userRepository = new InMemoryUserRepository();

  beforeAll(async () => {
    await userRepository.create(manager);
    await userRepository.create(tech01);
  });

  it('should be able to delete a task', async () => {
    const repository = new InMemoryTaskRepository();
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));
    repository.create(new Task({ summary: 'Summary 02', createdAt: new Date(), userId: tech01.id! }));
    await new DeleteTaskUseCase(repository, userRepository).execute(manager.id!, { id: 2 });
    let response = await repository.findAll();
    expect(response.length).toEqual(1);
    await new DeleteTaskUseCase(repository, userRepository).execute(manager.id!, { id: 1 });
    response = await repository.findAll();
    expect(response.length).toEqual(0);
  });

  it('should throw an error when a non existent authUser try to delete a task', async () => {
    const repository = new InMemoryTaskRepository();
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));
    const usecase = new DeleteTaskUseCase(repository, userRepository);

    expect(usecase.execute(-1, {
      id: 1
    })).rejects.toThrowError('AuthUserNotFound');
  });

  it('should throw an error when non manager authUser try to delete a task', async () => {
    const repository = new InMemoryTaskRepository();
    repository.create(new Task({ summary: 'Summary 01', createdAt: new Date(), userId: tech01.id! }));
    const usecase = new DeleteTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!, {
      id: 1
    })).rejects.toThrowError('DeleteTaskOnlyManagerOperation');
  })
});