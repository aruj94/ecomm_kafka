import express, { NextFunction, Request, Response }  from "express";
import { CatalogService } from "../services/catalog_service";
import { CatalogRepository } from "../repository/catalogRepository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest } from "../DTO/product.dto";

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

export default router;