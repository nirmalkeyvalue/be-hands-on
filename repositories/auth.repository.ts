import { Repository } from "typeorm";
import User from "../entities/user.entity";

class AuthRepository {
  constructor(private repository: Repository<User>) {}

  createUser(user: User) : Promise<User> {
    return this.repository.save(user);
  }

  findUserByEmail(email: string) : Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}

export default AuthRepository;