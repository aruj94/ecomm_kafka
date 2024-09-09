import axios from "axios";
import { logger } from "../logger";
import { NotFoundError } from "../error";
import { Product } from "../../DTO/product.dto";

const CATALOG_BASE_URL = process.env.CATALOG_URL || "http://localhost:8000";

export const getProductDetails = async (productId: number) => {
    try {
        const response = await axios.get(`${CATALOG_BASE_URL}/products/${productId}`);
        return response.data as Product;
    } catch(error) {
        logger.error(error);
        throw new NotFoundError("product not found");
    }
};