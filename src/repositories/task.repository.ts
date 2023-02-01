import { Task } from "../entities/task.entity";

export interface TaskRepository {

  findAll(): Promise<Task[]>;

  findAllByUserId(userId: number): Promise<Task[]>;

  findById(id: number): Promise<Task | null>;

  create(task: Task): Promise<void>;

  update(task: Task): Promise<void>;

  deleteById(id: number): Promise<void>;

}