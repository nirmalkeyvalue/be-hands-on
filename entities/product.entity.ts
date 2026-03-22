import {Column, Entity, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import OrderItem from "./orderitem.entity";

@Entity()
class Product extends AbstractEntity {
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ type: "real" })
  price!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  items!: OrderItem[];
}

export default Product;