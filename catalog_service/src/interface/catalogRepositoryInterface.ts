import { Product } from "../models/product_model";

export interface ICatalogRepository {
    create(data: Product): Promise<Product>;
    update(data: Product): Promise<Product>;
    delete(id: any): any;
    find(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
}