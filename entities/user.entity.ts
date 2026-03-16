import { Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
class User extends AbstractEntity {
  @Column()
  name!: string;
  
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: UserRole;
}

export default User;