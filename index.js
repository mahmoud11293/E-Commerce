import express from "express";
const app = express();
import { config } from "dotenv";
import { connection_db } from "./DB/connection_db.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import * as router from "./src/Modules/index.js";
import { disableCouponsCron } from "./src/utils/cron.utils.js";
import { gracefulShutdown } from "node-schedule";
import { createHandler } from "graphql-http/lib/use/express";
import { mainSchema } from "./src/GraphQL/Schema/index.js";
import cors from "cors";
import { socketConnection } from "./src/utils/socket.io.utils.js";
app.use(express.json());
app.use(cors());
config();
const port = process.env.PORT || 5000;

// GraphGl
app.use("/graphql", createHandler({ schema: mainSchema }));
// Rest API
app.use("/categories", router.categoryRouter);
app.use("/sub-category", router.subCategoryRouter);
app.use("/brand", router.brandRouter);
app.use("/products", router.productRouter);
app.use("/users", router.userRouter);
app.use("/addresses", router.addressRouter);
app.use("/carts", router.cartRouter);
app.use("/coupons", router.couponRouter);
app.use("/orders", router.orderRouter);
app.use("/reviews", router.reviewRouter);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found", status: 404 });
});

// Global Error Handler
app.use(globalResponse);
// Connection Database
connection_db();

// Cron Job
disableCouponsCron();
gracefulShutdown();

const serverApp = app.listen(port, () =>
  console.log("Server is Running", port)
);

socketConnection(serverApp);
