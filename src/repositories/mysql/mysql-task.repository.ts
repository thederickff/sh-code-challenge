import { Task } from "../../entities/task.entity";
import { TaskRepository } from "../task.repository";
import { execute } from '../../config/database.config';

export class MySqlTaskRepository implements TaskRepository {

  async findAll(): Promise<Task[]> {
    const rs = await execute(`select * from tasks`);

    return rs.map((item: any) => this.rowMap(item));
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    const rs = await execute(`select * from tasks where user_id = ?`, [userId]);

    return rs.map((item: any) => this.rowMap(item));
  }

  async findById(id: number): Promise<Task | null> {
    const rs = await execute(`select * from tasks where id = ?`, [id]);

    if (!rs.length) {
      return null;
    }

    return this.rowMap(rs[0]);
  }

  async create(task: Task): Promise<void> {
    await execute(`insert into tasks (summary, user_id, created_at) values (?, ?, ?)`, [
      task.summary,
      task.userId,
      this.parseDate(task.createdAt)
    ]);
  }

  async update(task: Task): Promise<void> {
    await execute(`update tasks set summary = ?, created_at = ? where id = ?`, [
      task.summary,
      this.parseDate(task.createdAt),
      task.id!
    ]);
  }

  async deleteById(id: number): Promise<void> {
    await execute(`delete from tasks where id = ?`, [id]);
  }

  private rowMap(resultSet: any): Task {
    const task = new Task({
      summary: resultSet.summary,
      createdAt: new Date(resultSet.created_at),
      userId: resultSet.user_id
    });
    task.id = resultSet.id;

    return task;
  }

  private parseDate(date: Date): string {
    return date.toISOString().split('T').join(' ').split('.')[0];
  }
}