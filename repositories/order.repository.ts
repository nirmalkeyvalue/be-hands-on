import { Repository } from "typeorm";
import Order, { OrderStatus } from "../entities/order.entity";
import OrderItem from "../entities/orderitem.entity";
import Product from "../entities/product.entity";

export interface OrderProduct {
  productId: number;
  quantity: number;
}

export interface UpdateOrderProperties {
  address?: string;
}

class OrderRepository {
  constructor(private repository: Repository<Order>) {}

  async create(userId: number, orderProducts: OrderProduct[], address: string) : Promise<Order> {
    const newOrder = new Order();
    newOrder.status = OrderStatus.PENDING;
    newOrder.userId = userId;
    newOrder.address = address;
    newOrder.items = orderProducts.map(item => {
      const newItem = new OrderItem();
      newItem.productId = item.productId;
      newItem.quantity = item.quantity;
      return newItem;
    });

    return this.repository.save(newOrder);
  }

  async getById(id: number, userId: number) : Promise<Order | null> {
    return this.repository.findOne({
      where: { id, userId },
      relations: { items: { product: true } },
    });
  }

  async getAll(userId: number): Promise<Order[]> {
    return this.repository.find({ where: { userId } });
  }

  async update(id: number, userId: number, order: Partial<Order>): Promise<{ success: boolean }> {
    const result = await this.repository.update({ id, userId }, {
      ...order
    });

    console.log('result', result);

    return { success: (result.affected ?? 0) > 0 };
  }

  async cancel(id: number, userId: number): Promise<{ success: boolean }> {
    const result = await this.repository.update(
      { id, userId },
      { status: OrderStatus.CANCELLED }
    );
    return { success: (result.affected ?? 0) > 0 };
  }
}

export default OrderRepository;