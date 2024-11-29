import { CartLineItem } from "../db/schema";
import { CartEditRepositoryInput, CartRepositoryInput } from "../DTO/cartRequest.dto";
import { cartRepository, CartRepositoryType, updateCart } from "../repository/cart_repository";
import { getProductDetails, logger, NotFoundError } from "../utils";

export const createCart = async (input: CartRepositoryInput & { customerId: number }, repo: CartRepositoryType) => {
    // get product details from catalog service
    const product = await getProductDetails(input.productId);
    logger.info(product);

    if (product.stock < input.qty) {
        throw new NotFoundError("product is out of stock");
    }

    // check if the product already exists in cart
    const lineItem = await repo.findCartByProductId(input.customerId, input.productId);
    if (lineItem) {
        return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
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

    // get customer cart data
    const cart = await repo.findCart(id);
    if (!cart) {
        throw new NotFoundError("Cart not found");
    }

    // list all the items in the cart
    const lineItems = cart.lineItems

    if (!lineItems.length) {
        throw new NotFoundError("Cart items not found");
    }

    // verify with inventory service if the item is still available
    // return updated cart data with latest stock availability

    return cart;
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
