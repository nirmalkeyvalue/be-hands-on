import express from "express";
import { CreateOrderDto } from "../dto/order/create-order.dto";
import { OrderIdParamDto } from "../dto/order/order-id-param.dto";
import { UpdateOrderRequestDto } from "../dto/order/update-order.dto";
import HttpException from "../exception/http.exception";
import Order from "../entities/order.entity";
import { OrderProduct } from "../repositories/order.repository";
import OrderService from "../services/order.service";
import ProductService from "../services/product.service";
import { validateDto } from "../utils/validate-dto";

export class OrderController {
  router: express.Router;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {
    this.router = express.Router();

    this.router.get("/", this.getOrders.bind(this));
    this.router.post("/", this.createOrder.bind(this));
    this.router.get("/:id", this.getOrderById.bind(this));
    this.router.patch("/:id", this.updateOrder.bind(this));
    this.router.delete("/:id", this.cancelOrder.bind(this));
  }

  public getOrders = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const products = await this.orderService.getOrders(userId!);
    res.status(200).json({ data: products });
  };

  public createOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const dto = await validateDto(CreateOrderDto, req.body);
    const productIds = [...new Set(dto.orderItems.map((item) => item.productId))];
    const products = await this.productService.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new HttpException(404, "some products not found");
    }
    const order = await this.orderService.createOrder(
      userId!,
      dto.orderItems as OrderProduct[],
      dto.address
    );
    res.status(201).json({ data: order });
  };

  public getOrderById = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const paramsDto = await validateDto(OrderIdParamDto, { id: req.params.id });
    const order = await this.orderService.getOrderById(Number(paramsDto.id), userId!);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    res.status(200).json({ data: order });
  };

  public updateOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const paramsDto = await validateDto(OrderIdParamDto, { id: req.params.id });
    const bodyDto = await validateDto(UpdateOrderRequestDto, req.body);
    const updateOrderProperties: Partial<Order> = bodyDto.updateOrderProperties;
    const order = await this.orderService.updateOrder(Number(paramsDto.id), userId!, updateOrderProperties);
    res.status(200).json({ data: order });
  };

  public cancelOrder = async (req: express.Request, res: express.Response) => {
    const userId = req?.user?.id;
    const paramsDto = await validateDto(OrderIdParamDto, { id: req.params.id });
    const result = await this.orderService.cancelOrder(Number(paramsDto.id), userId!);
    res.status(200).json({ data: result });
  };
}

export default OrderController;