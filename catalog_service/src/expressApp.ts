import express from "express";
import catalogRouter from "./API/catalog_routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils/broker/message_broker";
import { Consumer } from "kafkajs";

const ExpressApp = async () => {
    const app = express();
    app.use(express.json());
    app.use(httpLogger);

    app.use("/", catalogRouter);

    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", () => {
        console.log("catalog consumer connected");
    });

    // subscribe to the topic or publish a message
    await MessageBroker.subscribe((message) => {
        console.log("Catalog consumer reveived the message");
        console.log("Catalog message received", message);
    }, "OrderEvents");

    app.use(HandleErrorWithLogger);

    return app;
}

export default ExpressApp;
