import { CartRepositoryType } from "../types/repository_types";

const createCart = async (input: any): Promise<{}> => {
    // read/write database
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