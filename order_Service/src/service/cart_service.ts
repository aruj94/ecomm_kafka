import { CartLineItem } from "../db/schema";
import { CartEditRepositoryInput, CartRepositoryInput } from "../DTO/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart_repository";
import { getProductDetails, logger, NotFoundError } from "../utils";

export const createCart = async (input: CartRepositoryInput, repo: CartRepositoryType) => {
    // make asynchronous call to catalog microservice
    const product = await getProductDetails(input.productId);
    logger.info(product);

    if (product.stock < input.qty) {
        throw new NotFoundError("product is out of stock");
    }
    
    const data = await repo.createCart(input.customerId, {
            productId: product.id,
            itemName: product.name,
            price: product.price.toString(), 
            qty: input.qty, 
            variant: product.variant,
        } as CartLineItem
    );
}

export const getCart = async (id: number, repo: CartRepositoryType) => {
    const data = await repo.findCart(id);
    if (!data) {
        throw new NotFoundError("Cart not found");
    }

    return data;
}

export const deleteCart = async (id: number, repo: CartRepositoryType) => {
    const data = await repo.deleteCart(id);
    if (!data) {
        throw new NotFoundError("Cart not found");
    }

    return data;
}

export const editCart = async (input: CartEditRepositoryInput, repo: CartRepositoryType) => {
    const data = await repo.updateCart(input.id, input.qty);
    return data;
}
