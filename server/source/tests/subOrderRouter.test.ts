import supertest from "supertest";
import { getConnection } from "typeorm";
import connection from "../utils/mockDbConnection";
import createServer from './../utils/mockServer';
import { initDatabaseConnection } from './../config/db';
import { SubOrder } from "../entity/SubOrder";
import { generateToken } from './../../utils';
import { Customer } from './../entity/Customer';
import { Book } from './../entity/Book';
import { Users } from './../entity/Users';
import { Purchase } from "../entity/Purchase";
import { subOrderRouter } from "../routes/subOrderRouter";

const app = createServer();


beforeAll(async () => {
    await initDatabaseConnection();
  });
  
  afterAll(async () => {
    await connection.close();
  });

describe("get order by purchase id" , () => {
    describe("given expected order", () => {
        it("should return the whole order", async () => {

            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwicm9sZSI6InVzZXIiLCJmaXJzdE5hbWUiOiJUZXN0b3d5IiwibGFzdE5hbWUiOiJUZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuZXUiLCJpYXQiOjE2NDEwNzg0NjAsImV4cCI6MTY0MzY3MDQ2MH0.I74Lv3pI9b9soeeF-QZFrnpl5hxJZt2Jvhq9hLn0v3k';
            const id = 119;
            const order = await getConnection()
            .getRepository(SubOrder)
            .createQueryBuilder("suborder")
            .leftJoinAndSelect("suborder.purchase", "purchase")
            .leftJoinAndSelect("purchase.customer", "customer")
            .leftJoinAndSelect("suborder.book", "book")
            .leftJoinAndSelect("customer.users", "users")
            .where("purchase.id = :id")
            .setParameters({id: id})
            .getRawMany();
            const orderToJson = JSON.stringify(order);

            const {body, statusCode} = await supertest(app).get(`/api/order/${id}`)
            .auth(token, {type: 'bearer'})

            const bodyToJson = JSON.stringify(body);

            expect(bodyToJson).toEqual(orderToJson);
        })
    })
});

describe("create new order", () => {
    describe("order created successfully", () => {
        it("should get 201 status", async () => {
            const getBook = await getConnection()
            .getRepository(Book)
            .createQueryBuilder("book")
            .where("id = :id")
            .setParameters({id: 40})
            .getOne();

            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJ1c2VyIiwiZmlyc3ROYW1lIjoiSmFuIiwibGFzdE5hbWUiOiJLb3dhbHNraSIsImVtYWlsIjoidGVzdEB0ZXN0LnBsIiwiaWF0IjoxNjQxNzUwNTMwLCJleHAiOjE2NDQzNDI1MzB9.RJ-6muUQ_wVr3hFKJRO_xYdnhn6T0iaHZNbfZKT4PcU";

            const cartItems = [
                {
                    book: getBook?.id,
                    countinstock: getBook?.countinstock,
                    description: getBook?.description,
                    pages: getBook?.pages,
                    photo: getBook?.photo,
                    price: getBook?.price,
                    quantity: 1,
                    title: getBook?.title
                }
            ];
            const itemsPrice = 119.99;
            const paymentMethod = 'Stripe';
            const shippingAddress = {
                address: "ul. Testowa 2",
                city: "Bydgoszcz",
                fullName: "Jan Testowy",
                postalCode: "85-796"
            }
            const shippingPrice = 0;
            const totalPrice = 119.99;
            const userInfo = {
                email: "test@test.pl",
                firstName: "Jan",
                id: 10,
                lastName: "Kowalski",
                role: "user",
                token: token
            }
               
            const order = {
                    cartItems,
                    itemsPrice,
                    paymentMethod,
                    shippingAddress,
                    shippingPrice,
                    totalPrice,
                    userInfo
            }

            const {body, statusCode} = await supertest(app).post('/api/orders').send(order)
            .auth(token, {type: 'bearer'});

            expect(statusCode).toEqual(201);

        })
    })
})