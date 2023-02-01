import { beforeAll, describe, expect, it } from "vitest";
import { SaveTaskUseCase } from "./save-task.usecase";
import { Task } from "../../entities/task.entity";
import { InMemoryTaskRepository } from "../../repositories/in-memory/in-memory-task.repository";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-user.repository";
import { User } from "../../entities/user.entity";

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

  it('should be able to create a task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);
    let response = await usecase.execute(tech01.id!, {
      summary: 'Summary 01',
      userId: tech01.id!
    });

    expect(response).toBeInstanceOf(Task);
    expect(response.id).toEqual(1);

    response = await usecase.execute(tech01.id!, {
      summary: 'Summary 02',
      userId: tech01.id!
    });

    expect(response.id).toEqual(2);
  });

  it('should be able to update a task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);
    let response = await usecase.execute(tech01.id!, {
      summary: 'Summary 01',
      userId: tech01.id!
    });

    expect(response.summary).toEqual('Summary 01');

    response = await usecase.execute(tech01.id!, {
      summary: 'Summary 02',
      userId: tech01.id!,
      id: 1
    });

    expect(response.summary).toEqual('Summary 02');
  });

  it('should throw an error if summary length is not in [0-2500] range', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!, {
      summary: '', userId: tech01.id!
    })).rejects.toThrowError('SaveTaskSummaryLengthNotInCorrectRange');

    const array = [];
    for (let i = 0; i < 2500; ++i) {
      array.push('*');
    }
    const summary = array.join('');

    let response = await usecase.execute(tech01.id!, {
      summary, userId: tech01.id!
    });

    expect(response.summary).toEqual(summary);
    array.push('*');

    expect(usecase.execute(tech01.id!, {
      summary: array.join(''), userId: tech01.id!
    })).rejects.toThrowError('SaveTaskSummaryLengthNotInCorrectRange');
  })

  it('should throw an error when updating a non existing task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!, {
      summary: 'Summary 01',
      userId: tech01.id!,
      id: 1
    })).rejects.toThrowError('SaveTaskUpdateIdNotFound');
  })

  it('should throw an error when non existent authUser try to save a task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    expect(usecase.execute(-1, {
      summary: 'Summary 01',
      userId: tech01.id!,
    })).rejects.toThrowError('AuthUserNotFound');
  })

  it('should throw an error when a manager try to create a task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    expect(usecase.execute(manager.id!, {
      summary: 'Summary 01',
      userId: tech01.id!
    })).rejects.toThrowError('SaveTaskOnlyTechnicianOperation');

    expect(usecase.execute(manager.id!, {
      summary: 'Summary 01',
      userId: manager.id!
    })).rejects.toThrowError('SaveTaskOnlyTechnicianOperation');
  })

  it('should throw an error when a manager try to update a task', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    await usecase.execute(tech01.id!, {
      summary: 'Summary 01',
      userId: tech01.id!
    });

    expect(usecase.execute(manager.id!, {
      summary: 'Summary 02',
      userId: tech01.id!,
      id: 1
    })).rejects.toThrowError('SaveTaskOnlyTechnicianOperation');
  });

  it('should throw an error when a technician try to create a task for other user', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    expect(usecase.execute(tech01.id!, {
      summary: 'Summary 02',
      userId: tech02.id!
    })).rejects.toThrowError('SaveTaskOnlyTaskForAuthUser');
  })

  it('should throw an error when a technician try to update a task from other user', async () => {
    const repository = new InMemoryTaskRepository();
    const usecase = new SaveTaskUseCase(repository, userRepository);

    await usecase.execute(tech02.id!, {
      summary: 'Summary 01',
      userId: tech02.id!
    });

    expect(usecase.execute(tech01.id!, {
      summary: 'Summary 02',
      userId: tech01.id!,
      id: 1
    })).rejects.toThrowError('SaveTaskOnlyTaskOfAuthUser');
  })
});