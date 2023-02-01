import { describe, expect, it } from "vitest";
import { User } from "../../entities/user.entity";
import { InMemoryUserRepository } from "../../repositories/in-memory/in-memory-user.repository";
import { FindUserUseCase } from "./find-user.usecase";

describe('Create User Use Case', () => {
  it('should be able to find an user by id', async () => {
    const repository = new InMemoryUserRepository();
    repository.create(new User({ name: 'User 01', type: 'manager' }));
    repository.create(new User({ name: 'User 02', type: 'technician' }));

    let response = await new FindUserUseCase(repository).execute({ id: 2 });
    expect(response.type).toEqual('technician');

    response = await new FindUserUseCase(repository).execute({ id: 1 });
    expect(response.type).toEqual('manager');
  });

  it('should throw UserNotFound when user id does not exists', async () => {
    const repository = new InMemoryUserRepository();
    repository.create(new User({ name: 'User 01', type: 'manager' }));

    expect(new FindUserUseCase(repository).execute({ id: 2 })).rejects.toThrow();
  });
});