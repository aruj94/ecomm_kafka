import express, { NextFunction, Request, Response }  from "express";
import { createCart, deleteCart, editCart, getCart } from "../service/cart_service";
import { cartRepository } from "../repository/cart_repository";
import { validateRequest } from "../utils/validator";
import { CartRepositoryInput, CartRequestSchema } from "../DTO/cartRequest.dto";
import { requestAuthorizer } from "./middleware";

const router = express.Router();
const repo = cartRepository

router.get('/cart', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const user = req.user
        if (!user) {
            next(new Error("User not found"));
            return;
        }

        const response = await getCart(req.body.customer_id, repo);
        return res.status(200).json(response);
    } catch(error) {
        next(Error);
    }
});

router.post('/cart', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) =>{
    try{ 
        const user = req.user
        if (!user) {
            next(new Error("User not found"));
            return;
        }

        const err = validateRequest<CartRepositoryInput>(req.body, CartRequestSchema);

        if (err) {
            return res.status(404).json({ err });
        }

        const input: CartRepositoryInput = req.body

        const response = await createCart({ ...input, customerId: user.id }, repo);
        return res.status(200).json(response);
    } catch(error) {
        return res.status(404).json({ error });
    }
});

router.patch('/cart/:lineItemId', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) =>{
    const lineItemId = parseInt(req.params.lineItemId);
    const response = await editCart({id: +lineItemId, qty: req.body.qty}, repo);
    return res.status(200).json(response);
});

router.delete('/cart/:lineItemId', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) =>{
    const lineItemId = parseInt(req.params.lineItemId);
    const response = await deleteCart(+lineItemId, repo);
    return res.status(200).json(response);
});

export default router;