import supertest from "supertest";
import { getConnection } from "typeorm";
import { Category } from "../entity/Category";
import connection from "../utils/mockDbConnection";
import createServer from './../utils/mockServer';
import { initDatabaseConnection } from './../config/db';
import { Book } from "../entity/Book";

const app = createServer();

beforeAll(async () => {
    await initDatabaseConnection();
  });
  
  afterAll(async () => {
    await connection.close();
  });

describe("get books by search query" , () => {
    describe("given expected book and page values", () => {
        it("should return a book with such a keyword", async () => {
            const pageSize = 5;
            const page = 1;
            const inputKeyword = 'thousand';
            const qb = await getConnection()
            .getRepository(Book)
            .createQueryBuilder("book")
            .leftJoinAndSelect("book.category", "category")
            .leftJoinAndSelect("book.publisher", "publisher")
            .leftJoinAndSelect((subQuery) =>
            subQuery
            .select('"bookId" as "book_id"')
            .addSelect("array_agg(a.full_name) as authors_names")
            .from("author_books_book", "abb")
            .leftJoin("author", "a", `abb."authorId"=a.id`)
            .groupBy("book_id"), "authors", `book.id=authors."book_id"`)
            .where("book.keywords LIKE :title", {title: `%${inputKeyword}%`})
            .limit(pageSize)
            .offset((pageSize * page) - pageSize)
            
            const books = await qb.getRawMany();

            const count = await qb.getCount();

            const comparedObject = { books: books, page, pages: Math.ceil(count / pageSize) };
            const outputObject = JSON.stringify(comparedObject);

            const {body, statusCode} = await supertest(app).get(`/api/books/?title=${inputKeyword}`);
            const inputObject = JSON.stringify(body);

            expect(inputObject).toEqual(outputObject);
        })
    })
});