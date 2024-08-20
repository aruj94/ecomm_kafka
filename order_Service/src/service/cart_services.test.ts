import request from "supertest";
import { cartRepository } from "../repository/cart_repository";
import { CartRepositoryType } from "../types/repository_types";
import { faker } from '@faker-js/faker'
import express from "express";
import cartRouter from "../routes/cart_routes"

const app = express();
app.use(express.json());
app.use("/", cartRouter);

const mockproduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
    };
};



describe("CartServices", () => {
    let repo: CartRepositoryType;

    beforeEach(() => {
        repo = cartRepository;
    });

    afterEach(() => {
        repo = {} as CartRepositoryType;
    });

    describe("POST /cart", () => {
        test("should return correct data while creating the cart", async() => {
            const reqbody = mockproduct();
            const product = {
                "item": "a computer",
                "price": 1000
            }

            jest.spyOn(repo, 'create').mockImplementationOnce(() => Promise.resolve({
                message: "mock response from create cart", 
                input: product
            }));

            const response = await request(app)
                .post("/cart")
                .send(reqbody)
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "mock response from create cart", 
                input: product
            });
        });
    });

});