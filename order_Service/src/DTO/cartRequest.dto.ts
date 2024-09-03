import { Static, Type } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
    productId: Type.Integer(),
    customerId: Type.Integer(),
    qty: Type.Integer(),
});

export type CartRepositoryInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
    id: Type.Integer(),
    qty: Type.Integer(),
});

export type CartEditRepositoryInput = Static<typeof CartEditRequestSchema>;
