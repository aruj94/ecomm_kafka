import { Static, Type } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
    productId: Type.Integer(),
    qty: Type.Integer(),
});

export type CartRepositoryInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
    id: Type.Integer(),
    qty: Type.Integer(),
});

export type CartEditRepositoryInput = Static<typeof CartEditRequestSchema>;

type CartLineItems = {
    id: number;
    productId: number;
    itemName: string;
    variant: string | null;
    qty: number;
    price: string;
    createdAt: Date;
    updatedAt: Date;
    availability?: number;
};

export interface CartWithLineItems {
    id: number;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
    lineItems: CartLineItems[];
}
