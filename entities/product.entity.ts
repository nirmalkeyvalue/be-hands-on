import {Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity";

@Entity()
class Product extends AbstractEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;
}

export default Product;