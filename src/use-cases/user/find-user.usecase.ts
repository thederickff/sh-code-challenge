import { User } from "../../entities/user.entity";
import { UserRepository } from "../../repositories/user.repository";

interface FindUserRequest {
  id: number;
}

type FindUserResponse = User;

export class FindUserUseCase {

  constructor(
    private userRepository: UserRepository
  ) { }

  async execute({ id }: FindUserRequest): Promise<FindUserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('UserNotFound');
    }

    return user;
  }
}