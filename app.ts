import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import dataSource from "./db/data-source";
import HttpException from "./exception/http.exception";
import productRouter from "./routes/product.routes";
import authRouter from "./routes/auth.routes";
import authenticationMiddleware from "./middlewares/authenticationMiddleware";
import orderRouter from "./routes/order.routes";

dotenv.config();

const server = express();
server.use(express.json());

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

    server.use(
      (
        err: unknown,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        if (err instanceof HttpException) {
          res.status(err.status).json({ message: err.message });
          return;
        }
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    );

    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to db", e);
    process.exit(1);
  }
})();