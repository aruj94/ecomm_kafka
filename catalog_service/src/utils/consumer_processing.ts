import { catalogSerivce } from "../API/catalog_routes";
import { NotFoundError } from "./error";

export const handleOrderEvent = async (orderItems: any) => {

    for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i];

        try {
            const product = await catalogSerivce.getProduct(item.productId);

            if (item.quantity > product.stock) {
                throw new NotFoundError("product is out of stock");
            }

        } catch(error) {

        }
    }
}