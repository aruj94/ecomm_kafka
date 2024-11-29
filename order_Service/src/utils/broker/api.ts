import axios from "axios";
import { logger } from "../logger";
import { AuthorizationError, NotFoundError } from "../error";
import { Product } from "../../DTO/product.dto";
import { MessageBroker } from "./message_broker";
import { OrderEvent } from "../../types/subscription_type";
import { User } from "../../DTO/user.model";

const CATALOG_BASE_URL = process.env.CATALOG_URL || "http://localhost:8000";
const USER_SERVICE_URL = process.env.USER_URL || "http://localhost:9003";

export const getProductDetails = async (productId: number) => {
    /*try{
        // publish the message
        await MessageBroker.publish({
            topic: "CatalogEvents",
            headers: { token: header.authorization },
            event: OrderEvent.CREATE_CART,
            message: {
                orderId: 1,
                items: [
                    {
                        productId: 1,
                        quantity: 1,
                    },
                    {
                        productId: 2,
                        quantity: 2,
                    },
                ]
            }
        });
    }*/
    


    try {
        const response = await axios.get(`${CATALOG_BASE_URL}/products/${productId}`);
        return response.data as Product;
    } catch(error) {
        logger.error(error);
        throw new NotFoundError("product not found");
    }
};

export const ValidateUser = async (token: string) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/validate`, {
            headers: {
                Authorization: token,
            },
        });

        if (response.status !== 200) {
            throw new AuthorizationError("user not authorized");
        }

        return response.data as User;
    } catch(error) {
        throw new AuthorizationError("user not authorized");
    }
}