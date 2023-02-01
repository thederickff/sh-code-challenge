import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../../repositories/task.repository";
import { UserRepository } from "../../repositories/user.repository";

interface SaveTaskRequest {
  id?: number;
  summary: string;
  userId: number;
}

type SaveTaskResponse = Task;

export class SaveTaskUseCase {

  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository
  ) { }

  async execute(authUserId: number, { id, summary, userId }: SaveTaskRequest): Promise<SaveTaskResponse> {

    if (!summary || !summary.length || summary.length > 2500) {
      throw new Error('SaveTaskSummaryLengthNotInCorrectRange');
    }

    const task = new Task({ summary, createdAt: new Date(), userId });
    const authUser = await this.userRepository.findById(authUserId);

    if (!authUser) {
      throw new Error('AuthUserNotFound');
    }

    if (authUser.type !== 'technician') {
      throw new Error('SaveTaskOnlyTechnicianOperation');
    }

    if (authUser.id !== task.userId) {
      throw new Error('SaveTaskOnlyTaskForAuthUser');
    }

    if (id) {
      const taskToUpdate = await this.taskRepository.findById(id);

      if (!taskToUpdate) {
        throw new Error('SaveTaskUpdateIdNotFound');
      }

      if (authUser.id !== taskToUpdate.userId) {
        throw new Error('SaveTaskOnlyTaskOfAuthUser');
      }

      task.id = id;
      this.taskRepository.update(task);
    } else {
      this.taskRepository.create(task);
    }

    console.log(`The tech ${authUser.name} performed the task ${task.summary} on date ${task.createdAt}`);

    return task;
  }
}