import { CartRepositoryInput } from "../DTO/cartRequest.dto";
import { CartRepositoryType } from "../types/repository_types";
import { getProductDetails, logger } from "../utils";

export const createCart = async (input: CartRepositoryInput, repo: CartRepositoryType) => {
    // make asynchronous call to catalog microservice
    const product = await getProductDetails(input.productId);
    logger.info(product);

    if (product.stock < input.qty) {
        throw new Error("product is out of stock");
    }
    
    return product;
}

export const getCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.find(input);
    return data;
}

export const deleteCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.delete(input);
    return data;
}

export const editCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.update(input);
    return data;
}