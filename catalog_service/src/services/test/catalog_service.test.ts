import { ICatalogRepository } from "../../interface/catalogRepositoryInterface";
import { Product } from "../../models/product_model";
import { CatalogRepository } from "../../repository/catalogRepository";
import { CatalogService } from "../catalog_service";
import { faker } from '@faker-js/faker'
import { productFactory } from "../../utils/fixtures";

const mockproduct = (rest: any) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({min: 10, max: 100}),
        ...rest,
    };
};

describe("CatalogService", () => {
    let repository: ICatalogRepository;

    beforeEach(() => {
        repository = new CatalogRepository();
    });
    
    afterEach(() => {
        repository = {} as CatalogRepository;
    });

    describe("createProduct", () => {
        test("create a product", async() => {
            const service = new CatalogService(repository);
            const reqBody = mockproduct({
                price: +faker.commerce.price()
            });
            const result = await service.createProduct(reqBody);

            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            });
        });

        test("throw an error when unable to create product", async() => {
            const service = new CatalogService(repository);
            const reqBody = mockproduct({
                price: +faker.commerce.price()
            });
            
            jest.spyOn(repository, 'create').mockImplementation(() => Promise.resolve({} as Product));
            
            await expect(service.createProduct(reqBody)).rejects.toThrow("unable to create product");
        });

        test("throw an error if product already exists", async() => {
            const service = new CatalogService(repository);
            const reqBody = mockproduct({
                price: +faker.commerce.price()
            });
            
            jest.spyOn(repository, 'create').mockImplementation(() => Promise.reject(new Error("product already exists")));
            
            await expect(service.createProduct(reqBody)).rejects.toThrow("product already exists");
        });
    });

    describe("updateProduct", () => {
        test("update a product", async() => {
            const service = new CatalogService(repository);
            const reqBody = mockproduct({
                price: +faker.commerce.price(),
                id: faker.number.int({min: 10, max: 1000}),
            });
            const result = await service.updateProduct(reqBody);

            expect(result).toMatchObject(reqBody);
        });

        test("throw an error if product does not exists", async() => {
            const service = new CatalogService(repository);
            
            jest.spyOn(repository, 'update').mockImplementation(() => Promise.reject(new Error("product does not exists")));
            
            await expect(service.updateProduct({})).rejects.toThrow("product does not exists");
        });
    });

    describe("getProducts", () => {
        test("should get products by offset and limit", async() => {
            const service = new CatalogService(repository);
            const randomLimit = faker.number.int({ min: 10, max: 50});
            const products = productFactory.buildList(randomLimit);
            
            jest.spyOn(repository, 'find').mockImplementation(() => Promise.resolve(products));

            const result = await service.getProducts(randomLimit, 0);
            
            expect(result.length).toEqual(randomLimit);
            expect(result).toMatchObject(products);
        });

        test("throw an error if products do not exist", async() => {
            const service = new CatalogService(repository);
            
            jest.spyOn(repository, 'find').mockImplementation(() => Promise.reject(new Error("products do not exist")));
            
            await expect(service.getProducts(0, 0)).rejects.toThrow("products do not exist");
        });
    });

    describe("getProduct", () => {
        test("should get product by id", async() => {
            const service = new CatalogService(repository);
            const product = productFactory.build();
            
            jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.resolve(product));

            const result = await service.getProduct(product.id!);

            expect(result).toMatchObject(product);
        });

        test("throw an error if product does not exists", async() => {
            const service = new CatalogService(repository);
            const product = productFactory.build();
            
            jest.spyOn(repository, 'findOne').mockImplementation(() => Promise.reject(new Error("product does not exists")));
            
            await expect(service.getProduct(product.id!)).rejects.toThrow("product does not exists");
        });
    });

    describe("deleteProduct", () => {
        test("delete product by id", async() => {
            const service = new CatalogService(repository);
            const product = productFactory.build();
            
            jest.spyOn(repository, 'delete').mockImplementation(() => Promise.resolve(product.id));

            const result = await service.deleteProduct(product.id!);

            expect(result).toEqual(product.id);
        });

        test("throw an error if product does not exists", async() => {
            const service = new CatalogService(repository);
            const product = productFactory.build();
            
            jest.spyOn(repository, 'delete').mockImplementation(() => Promise.reject(new Error("product does not exists")));
            
            await expect(service.deleteProduct(product.id!)).rejects.toThrow("product does not exists");
        });
    });
});