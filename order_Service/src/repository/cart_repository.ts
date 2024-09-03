import { DB } from "../db/db_connection";
import { carts } from "../db/schema";
import { CartRepositoryInput } from "../DTO/cartRequest.dto";
import { CartRepositoryType } from "../types/repository_types";

const createCart = async (input: CartRepositoryInput): Promise<{}> => {
    // connect to database
    const result = await DB.insert(carts).values({
        customerId: input.customerId,
    }).returning({ cartId: carts.id });

    console.log(result)

    return Promise.resolve({ 
        message: "mock response from create cart", 
        input: input}
    );
}

const findCart = async (input: any): Promise<{}> => {
    return Promise.resolve({
        message: "mock response from find cart", 
        input: input
    });
}

const updateCart = async (input: any): Promise<{}> => {
    return Promise.resolve({
        message: "mock response from update cart", 
        input: input
    });
}

const deleteCart = async (input: any): Promise<{}> => {
    return Promise.resolve({
        message: "mock response from delete cart", 
        input: input
    });
}

export const cartRepository: CartRepositoryType = {
    create: createCart,
    find: findCart,
    update: updateCart,
    delete: deleteCart
}