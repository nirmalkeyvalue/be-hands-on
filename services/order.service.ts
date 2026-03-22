import Order from "../entities/order.entity";
import OrderRepository, { OrderProduct } from "../repositories/order.repository";

class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async getOrderById(id: number, userId: number) {
    return this.orderRepository.getById(id, userId);
  }

  async getOrders(userId: number) {
    return this.orderRepository.getAll(userId);
  }

  async createOrder(userId: number, orderProducts: OrderProduct[], address: string): Promise<Order> {
    return this.orderRepository.create(userId, orderProducts, address);
  }

  async updateOrder(id: number, userId: number, order: Partial<Order>): Promise<{ success: boolean }> {
    return this.orderRepository.update(id, userId, order);
  }

  async cancelOrder(id: number, userId: number): Promise<{ success: boolean }> {
    return this.orderRepository.cancel(id, userId);
  }
}

export default OrderService;