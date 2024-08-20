import { CartRepositoryType } from "../types/repository_types"

export const createCart = async (input: any, repo: CartRepositoryType) => {
    const data = await repo.create(input);
    return data;
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