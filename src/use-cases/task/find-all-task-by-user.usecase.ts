import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";
import { UserRepository } from "../../repositories/user.repository";

interface FindAllByUserTaskRequest {
  userId: number;
}

type FindAllByUserTaskResponse = Task[];

export class FindAllByUserTaskUseCase {

  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository
  ) { }

  async execute(
    authUserId: number,
    { userId }: FindAllByUserTaskRequest
  ): Promise<FindAllByUserTaskResponse> {
    const authUser = await this.userRepository.findById(authUserId);

    if (!authUser) {
      throw new Error('AuthUserNotFound');
    }

    if (authUser.id !== userId && authUser.type !== 'manager') {
      throw new Error('FindAllTaskByUserOnlyManagerOperation');
    }

    return this.taskRepository.findAllByUserId(userId);
  }
}