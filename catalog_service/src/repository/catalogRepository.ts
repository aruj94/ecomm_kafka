import { ICatalogRepository } from "../interface/catalogRepositoryInterface";
import { Product } from "../models/product_model";

export class CatalogRepository implements ICatalogRepository {
    create(data: Product): Promise<Product> {
        
        const mockprod = {
            id: 1,
            ...data
        } as Product;

        return Promise.resolve(mockprod);
    }

    update(data: Product): Promise<Product> {
        return Promise.resolve(data as unknown as Product);
    }

    delete(id: any) {
        return Promise.resolve(id);
    }

    find(limit: number, offset: number): Promise<Product[]> {
        return Promise.resolve([]);
    }

    findOne(id: number): Promise<Product> {
        return Promise.resolve({ id } as unknown as Product);
    }

}