import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import dataSource from "./db/data-source";
import errorMiddleware from "./middlewares/errorMiddleware";
import requestLogger from "./middlewares/requestLogger";
import productRouter from "./routes/product.routes";
import authRouter from "./routes/auth.routes";
import authenticationMiddleware from "./middlewares/authenticationMiddleware";
import orderRouter from "./routes/order.routes";

dotenv.config();

const server = express();
server.use(express.json());
server.use(requestLogger);

server.get("/health", (req, res) => {
  return res.json({ message: "OK" });
});

(async () => {
  try {
    await dataSource.initialize();
    console.log("Database connected");

    server.use("/products", authenticationMiddleware, productRouter);
    server.use("/orders", authenticationMiddleware, orderRouter);
    server.use("/auth", authRouter);

    server.use(errorMiddleware);

    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to db", e);
    process.exit(1);
  }
})();