import OrderController from "../controllers/order.controller";
import dataSource from "../db/data-source";
import Order from "../entities/order.entity";
import Product from "../entities/product.entity";
import OrderRepository from "../repositories/order.repository";
import ProductRepository from "../repositories/product.repository";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";

const orderRepository = new OrderRepository(dataSource.getRepository(Order));
const productRepository = new ProductRepository(dataSource.getRepository(Product));

const orderService = new OrderService(orderRepository);
const productService = new ProductService(productRepository);
const orderController = new OrderController(orderService, productService);

const orderRouter = orderController.router;

export default orderRouter;