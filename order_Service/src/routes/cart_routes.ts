import express, { NextFunction, Request, Response }  from "express";
import { createCart, deleteCart, editCart, getCart } from "../service/cart_service";
import { cartRepository } from "../repository/cart_repository";
import { validateRequest } from "../utils/validator";
import { CartRepositoryInput, CartRequestSchema } from "../DTO/cartRequest.dto";

const router = express.Router();
const repo = cartRepository

router.get('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    const response = await getCart(req, repo);
    return res.status(200).json(response);
});

router.post('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    try{ 
        const err = validateRequest<CartRepositoryInput>(req.body, CartRequestSchema);

        if (err) {
            return res.status(404).json({ err });
        }

        const response = await createCart(req.body as CartRepositoryInput, repo);
        return res.status(200).json(response);
    } catch(error) {
        return res.status(404).json({ error });
    }
});

router.patch('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    const response = await editCart(req, repo);
    return res.status(200).json(response);
});

router.delete('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    const response = await deleteCart(req, repo);
    return res.status(200).json(response);
});

export default router;