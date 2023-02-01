import { TaskRepository } from "../../repositories/task.repository";
import { UserRepository } from "../../repositories/user.repository";

interface DeleteTaskRequest {
  id: number;
}

type DeleteTaskResponse = void;

export class DeleteTaskUseCase {

  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository
  ) { }

  async execute(authUserId: number, { id }: DeleteTaskRequest): Promise<DeleteTaskResponse> {
    const authUser = await this.userRepository.findById(authUserId);

    if (!authUser) {
      throw new Error("AuthUserNotFound");
    }

    if (authUser.type !== 'manager') {
      throw new Error("DeleteTaskOnlyManagerOperation");
    }

    this.taskRepository.deleteById(id);
  }
}