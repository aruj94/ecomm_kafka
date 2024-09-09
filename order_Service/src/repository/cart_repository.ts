import { DB } from "../db/db_connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";

// decalre reporsitory types
export type CartRepositoryType = {
    createCart: (customerId: number, lineItems: CartLineItem) => Promise<number>;
    findCart: (id: number) => Promise<Cart>;
    updateCart: (id: number, qty: number) => Promise<CartLineItem>;
    deleteCart: (id: number) => Promise<Boolean>;
    clearCartData: (id: number) => Promise<Boolean>;
};

export const createCart = async (
    customerId: number,
    { itemName, price, productId, qty, variant }: CartLineItem
): Promise<number> => {
    const result = await DB.insert(carts)
        .values({
            customerId: customerId,
        })
        .returning()
        .onConflictDoUpdate({
            target: carts.customerId,
            set: { updatedAt: new Date() },
        });

    const [{ id }] = result;

    if (id > 0) {
        await DB.insert(cartLineItems).values({
            cartId: id,
            productId: productId,
            itemName: itemName,
            price: price,
            qty: qty,
            variant: variant,
        });
    }
    return id;
};

export const findCart = async (id: number): Promise<Cart> => {
    const cart = await DB.query.carts.findFirst({
        where: (carts, { eq }) => eq(carts.customerId, id),
        with: {
          lineItems: true,
        },
      });

    if (!cart) {
        throw new NotFoundError("cart not found");
    }

    return cart;
};

export const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
    const [CartLineItem] = await DB.update(cartLineItems)
        .set({
            qty: qty
        })
        .where(eq(cartLineItems.id, id))
        .returning();
    return CartLineItem;
};

export const deleteCart = async (id: number): Promise<boolean> => {
    await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
    return true;
}

const clearCartData = async (id: number): Promise<boolean> => {
    await DB.delete(carts).where(eq(carts.id, id)).returning();
    return true;
};

export const cartRepository: CartRepositoryType = {
    createCart,
    findCart,
    updateCart,
    deleteCart,
    clearCartData
};
