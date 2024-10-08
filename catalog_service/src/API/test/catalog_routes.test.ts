import request from "supertest";
import express from "express";
import catalogRouter, { catalogSerivce } from "../catalog_routes";
import { faker } from '@faker-js/faker'
import { productFactory } from "../../utils/fixtures";

const app = express();
app.use(express.json());
app.use("/", catalogRouter);

const mockproduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({min: 10, max: 100}),
        price: +faker.commerce.price(),
    };
};

describe("Catalog Routes", () => {
    describe("POST /products", () => {
        test("should create a product successfully", async () => {
            const reqbody = mockproduct();
            const product = productFactory.build();

            jest.spyOn(catalogSerivce, 'createProduct').mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
                .post("/products")
                .send(reqbody)
                .set("Accept", "application/json");

            expect(response.status).toBe(201);
            expect(response.body).toEqual(product);
        });

        test("should respond with a validation error 400", async () => {
            const reqbody = mockproduct();
            const response = await request(app)
                .post("/products")
                .send({...reqbody, name:""})
                .set("Accept", "application/json");
            expect(response.status).toBe(400);
            expect(response.body).toEqual("name should not be empty");
        });

        test("should respond with a error code of 500 for internal server errors", async () => {
            const reqbody = mockproduct();

            jest.spyOn(catalogSerivce, 'createProduct').mockImplementationOnce(() => Promise.reject(new Error("error occured while creating product")));

            const response = await request(app)
                .post("/products")
                .send(reqbody)
                .set("Accept", "application/json");
            expect(response.status).toBe(500);
            expect(response.body).toEqual("error occured while creating product");
        });
    });

    describe("PATCH /products/:id", () => {
        test("should update a product successfully", async () => {
            const product = productFactory.build();
            const reqBody = {
                name: product.name,
                price: product.price,
                stock: product.stock,
            };

            jest.spyOn(catalogSerivce, 'updateProduct').mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send(reqBody)
                .set("Accept", "application/json");
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });

        test("should respond with a validation error 400", async () => {
            const product = productFactory.build();
            const reqBody = {
                name: product.name,
                price: -1,
                stock: product.stock,
            };

            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send({...reqBody})
                .set("Accept", "application/json");

            expect(response.status).toBe(400);
            expect(response.body).toEqual("price must not be less than 1");
        });

        test("should respond with a error code of 500 for internal server errors", async () => {
            const product = productFactory.build();
            const reqBody = {
                name: product.name,
                price: product.price,
                stock: product.stock,
            };

            jest.spyOn(catalogSerivce, 'updateProduct').mockImplementationOnce(() => Promise.reject(new Error("unable to update product")));

            const response = await request(app)
                .patch(`/products/${product.id}`)
                .send(reqBody)
                .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to update product");
        });
    });

    describe("GET /products?limit=0&offset=0", () => {        
        test("should get products by offset and limit", async () => {
            const randomLimit = faker.number.int({ min: 10, max: 50});
            const products = productFactory.buildList(randomLimit);

            jest.spyOn(catalogSerivce, 'getProducts').mockImplementationOnce(() => Promise.resolve(products));

            const response = await request(app)
                .get(`/products?limit=${randomLimit}&offset=0`)
                .set("Accept", "application/json");
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);
        });

        test("should respond with a error code of 500 for internal server errors", async () => {
            const randomLimit = faker.number.int({ min: 10, max: 50});

            jest.spyOn(catalogSerivce, 'getProducts').mockImplementationOnce(() => Promise.reject(new Error("unable to get products")));

            const response = await request(app)
                .get(`/products?limit=${randomLimit}&offset=0`)
                .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to get products");
        });
    });

    describe("GET /products/:id", () => {        
        test("should get a product by id", async () => {
            const product = productFactory.build();

            jest.spyOn(catalogSerivce, 'getProduct').mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });

        test("should respond with a error code of 500 for internal server errors", async () => {
            const product = productFactory.build();

            jest.spyOn(catalogSerivce, 'getProduct').mockImplementationOnce(() => Promise.reject(new Error("unable to get product")));

            const response = await request(app)
                .get(`/products/${product.id}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to get product");
        });
    });

    describe("DELETE /products/:id", () => {        
        test("should delete a product by id", async () => {
            const product = productFactory.build();

            jest.spyOn(catalogSerivce, 'deleteProduct').mockImplementationOnce(() => Promise.resolve(product));

            const response = await request(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(product);
        });

        test("should respond with a error code of 500 for internal server errors", async () => {
            const product = productFactory.build();

            jest.spyOn(catalogSerivce, 'deleteProduct').mockImplementationOnce(() => Promise.reject(new Error("unable to delete product")));

            const response = await request(app)
                .delete(`/products/${product.id}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(500);
            expect(response.body).toEqual("unable to delete product");
        });
    });
});