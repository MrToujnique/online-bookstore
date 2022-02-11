import supertest from "supertest";
import { getConnection } from "typeorm";
import { Category } from "../entity/Category";
import connection from "../utils/mockDbConnection";
import createServer from './../utils/mockServer';
import { initDatabaseConnection } from './../config/db';

const app = createServer();

beforeAll(async () => {
    await initDatabaseConnection();
  });
  
  afterAll(async () => {
    await connection.close();
  });

describe("get categories", () => {
    describe("given categories exist", () => {
        it("should return a 200 status and categories", async () => {

            const data = await getConnection()
            .createQueryBuilder()
            .select("name")
            .from(Category, "name")
            .getMany();

            const {body, statusCode} = await supertest(app).get('/api/categories');

            expect(statusCode).toBe(200);

            expect(body).toEqual(data);
        });
    });
});
