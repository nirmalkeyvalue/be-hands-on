import express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import dataSource from "./db/data-source";
import productRouter from "./routes/product.routes";
import authRouter from "./routes/auth.routes";

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

    server.use("/products", productRouter);
    server.use("/auth", authRouter);
    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (e) {
    console.error("Failed to connect to db", e);
    process.exit(1);
  }
})();