import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";
import { UserRepository } from "../../repositories/user.repository";

type FindAllTaskResponse = Task[];

export class FindAllTaskUseCase {

  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository
  ) { }

  async execute(authUserId: number): Promise<FindAllTaskResponse> {
    const user = await this.userRepository.findById(authUserId);

    if (!user) {
      throw new Error('AuthUserNotFound');
    }

    if (user.type !== 'manager') {
      throw new Error('FindAllTaskOnlyManagerOperation');
    }

    return this.taskRepository.findAll();
  }
}