import {Column, Entity, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import OrderItem from "./orderitem.entity";

export enum OrderStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

@Entity()
class Order extends AbstractEntity {
  @Column()
  userId!: number;

  @Column()
  status!: OrderStatus;

  @Column()
  address!: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];
}

export default Order;