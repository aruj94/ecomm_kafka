import { ICatalogRepository } from "../interface/catalogRepositoryInterface";

export class CatalogService {

    private _repository: ICatalogRepository;

    constructor(repository: ICatalogRepository) {
        this._repository = repository;
    }

    async createProduct(input: any) {
        const data = await this._repository.create(input);

        if(!data || Object.keys(data).length === 0) {
            throw new Error("unable to create product");
        }

        return data;
    }

    async updateProduct(input: any) {
        const data = await this._repository.update(input);
        // event to update record in elastic search
        return data;
    }

    async getProducts(limit: number, offset: number) {
        const products = await this._repository.find(limit, offset);

        return products;
    }

    async getProduct(id: number) {
        const product = await this._repository.findOne(id);

        return product;
    }

    async deleteProduct(id: number) {
        const product_id = await this._repository.delete(id);

        return product_id;
    }
}
