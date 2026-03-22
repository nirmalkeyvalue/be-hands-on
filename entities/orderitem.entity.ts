import { Column, Entity, ManyToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Order from "./order.entity";
import Product from "./product.entity";

@Entity()
class OrderItem extends AbstractEntity {
  @Column()
  orderId!: number;

  @Column()
  productId!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;

  @ManyToOne(() => Product, (product) => product.items)
  product!: Product;
}

export default OrderItem;