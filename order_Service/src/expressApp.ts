import express, { Request, Response } from "express";
import cors from 'cors';
import order_router from "./routes/order_routes";
import cart_router from "./routes/cart_routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils";
import { Consumer, Producer } from "kafkajs";

export const ExpressApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(httpLogger);

    // connect producer and consumer
    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", () => {
        console.log("producer connected");
    });

    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", () => {
        console.log("consumer connected");
    });

    // subscribe to the topic or publish a message
    await MessageBroker.subscrible((message) => {
        console.log("Consumer reveive the message");
        console.log("Message received", message);
    }, "OrderEvents");

    app.use(order_router);
    app.use(cart_router);

    app.use(HandleErrorWithLogger);

    app.use("/", (req: Request, res: Response) => {
        return res.status(200).json({message: "Running on 9000"});
    });

    return app;
}
