import express, { NextFunction, Request, Response }  from "express";
import { createCart, deleteCart, editCart, getCart } from "../service/cart_service";
import { cartRepository } from "../repository/cart_repository";

const router = express.Router();
const repo = cartRepository

router.get('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    const response = await getCart(req, repo);
    return res.status(200).json(response);
});

router.post('/cart', async (req: Request, res: Response, next: NextFunction) =>{
    const response = await createCart(req.body, repo);
    return res.status(200).json(response);
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