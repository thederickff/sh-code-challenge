import { execute } from "../../config/database.config";
import { User } from "../../entities/user.entity";
import { UserRepository } from "../user.repository";

export class MySqlUserRepository implements UserRepository {

  async findById(id: number): Promise<User | null> {
    const rs = await execute(`select * from users where id = ?`, [id]);

    if (!rs.length) {
      return null;
    }

    return this.rowMap(rs[0]);
  }

  async create(user: User): Promise<void> {
    await execute(`insert into users (name, type) values (?, ?)`, [
      user.name,
      user.type
    ]);
  }

  async deleteById(id: number): Promise<void> {
    await execute(`delete from users where id = ?`, [id]);
  }

  private rowMap(resultSet: any) {
    const user = new User({
      name: resultSet.name,
      type: resultSet.type
    });

    user.id = resultSet.id;

    return user;
  }
}