import express, { NextFunction, Request, Response }  from "express";
import { CatalogService } from "../services/catalog_service";
import { CatalogRepository } from "../repository/catalogRepository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest, UpdateProductRequest } from "../DTO/product.dto";

const router = express.Router();

export const catalogSerivce = new CatalogService(new CatalogRepository());

router.post("/products", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { errors, input } = await RequestValidator(CreateProductRequest, req.body);

        if (errors) {
            return res.status(400).json(errors);
        }

        const data = await catalogSerivce.createProduct(input);
        return res.status(201).json(data);
    } catch(error) {
        const err = error as Error;
        return res.status(500).json(err.message);
    }
});

router.patch("/products/:id", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { errors, input } = await RequestValidator(UpdateProductRequest, req.body);

        if (errors) {
            return res.status(400).json(errors);
        }

        const id = parseInt(req.params.id) || 0;

        const data = await catalogSerivce.updateProduct({ id, ...input });
        return res.status(200).json(data);
    } catch(error) {
        const err = error as Error;
        return res.status(500).json(err.message);
    }
});

router.get("/products", async (req: Request, res: Response, next: NextFunction) => {

    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);

    try { 
        const data = await catalogSerivce.getProducts(limit, offset);
        return res.status(200).json(data);
    } catch(error) {
        const err = error as Error;
        return res.status(500).json(err.message);
    }
});

router.get("/products/:id", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = parseInt(req.params.id) || 0;
        const data = await catalogSerivce.getProduct(id);
        return res.status(200).json(data);
    } catch(error) {
        const err = error as Error;
        return res.status(500).json(err.message);
    }
});

router.delete("/products/:id", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const id = parseInt(req.params.id) || 0;
        const data = await catalogSerivce.deleteProduct(id);
        return res.status(200).json(data);
    } catch(error) {
        const err = error as Error;
        return res.status(500).json(err.message);
    }
});

export default router;