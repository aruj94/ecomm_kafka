import request from "supertest";
import express from "express";
import catalogRouter, { catalogSerivce } from "../catalog_routes";
import { faker } from '@faker-js/faker'
import { Product } from "../../models/product_model";
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

            console.log("TEST RESPONSE", response.body);

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
});