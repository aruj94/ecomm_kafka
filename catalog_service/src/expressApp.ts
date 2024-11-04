import express from "express";
import catalogRouter from "./API/catalog_routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils/broker/message_broker";
import { Consumer } from "kafkajs";
import { handleOrderEvent } from "./utils/consumer_processing";

const ExpressApp = async () => {
    const app = express();
    app.use(express.json());
    app.use(httpLogger);

    app.use("/", catalogRouter);

    const consumer = await MessageBroker.connectConsumer<Consumer>();
    consumer.on("consumer.connect", () => {
        console.log("consumer connected");
    });

    // subscribe to the topic or publish a message
    await MessageBroker.subscribe((message) => {
        console.log("Catalog consumer received the message");
        console.log("Catalog message received", message);
        handleOrderEvent(message.data.items);
    }, "OrderEvents");

    app.use(HandleErrorWithLogger);

    return app;
}

export default ExpressApp;
