import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../task.repository";

export class InMemoryTaskRepository implements TaskRepository {

  private items: Task[] = [];

  async findAll(): Promise<Task[]> {
    return this.items;
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    return this.items.filter(item => item.userId === userId);
  }

  async findById(id: number): Promise<Task | null> {
    const index = this.items.findIndex(item => item.id === id);

    if (index < 0) {
      return null;
    }

    return this.items[index];
  }

  async create(task: Task): Promise<void> {
    this.items.push(task);
    task.id = this.items.length;
  }

  async update(task: Task): Promise<void> {
    const index = this.items.findIndex(item => item.id === task.id);

    if (index > -1) {
      this.items[index] = task;
    }
  }

  async deleteById(id: number): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}