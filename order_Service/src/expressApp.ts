import express, { Request, Response } from "express";
import cors from 'cors';
import order_router from "./routes/order_routes";
import cart_router from "./routes/cart_routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";

const app = express();
app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use(order_router);
app.use(cart_router);

app.use(HandleErrorWithLogger);

app.use("/", (req: Request, res: Response) => {
    return res.status(200).json({message: "Running on 9000"});
});

export default app;