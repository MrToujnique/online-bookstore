import express from 'express';
import EndpointsController from '../controllers/EndpointsController';
import { Book } from '../entity/Book';
import { Category } from '../entity/Category';
import { Publisher } from './../entity/Publisher';
import { Author } from './../entity/Author';
import expressAsyncHandler from 'express-async-handler';
import { Between, createQueryBuilder, getManager, getRepository, IsNull, MoreThanOrEqual, getConnection } from 'typeorm';
import { isAuth } from '../../utils';
import { isSellerOrAdmin } from './../../utils';
import { Review } from './../entity/Review';
import { Length } from 'class-validator';

const router = express.Router();

router.get(
    "/books/",
    expressAsyncHandler(async (req, res) => {
      const pageSize = 5;
      const page = Number(req.query.pageNumber) || 1;
      const title = req.query.title || "";
      const category = req.query.category || "";
      const publisher = req.query.publisher || "";
      const order = req.query.order;
      const minPrice =
        req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
      const maxPrice =
        req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;

      const qb = await 
      getConnection()
      .getRepository(Book)
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.category", "category")
      .leftJoinAndSelect("book.publisher", "publisher")
      .leftJoinAndSelect((subQuery) =>
      subQuery
      .select('"bookId" as "book_id"')
      .addSelect("json_agg(json_build_object('first_name', a.first_name, 'last_name', a.last_name)) as authors_full_names")
      .from("author_books_book", "abb")
      .leftJoin("author", "a", `abb."authorId"=a.id`)
      .groupBy("book_id"), "authors", `book.id=authors."book_id"`)
      .offset((pageSize * page) - pageSize)
      .limit(pageSize)

      if(title !== "")
      {
        qb.andWhere("book.keywords LIKE :title", {title: `%${title}%`})
        .orWhere("book.title LIKE :title", {title: `%${title}%`})
      }
      if(category !== "")
      {
        qb.andWhere("category.name = :category", {category: category});
      }
      if(publisher !== "")
      {
        qb.andWhere("publisher.name = :publisher", {publisher: publisher});
      }
      if((minPrice && maxPrice) !== 0)
      {
        qb.andWhere("book.price BETWEEN :minPrice AND :maxPrice", {minPrice: minPrice, maxPrice: maxPrice})
      }
      else if(minPrice !== 0 && maxPrice === 0)
      {
        qb.andWhere("book.price >= :minPrice", {minPrice: minPrice})
      }
      else if(minPrice === 0 && maxPrice !== 0)
      {
        qb.andWhere("book.price <= :maxPrice", {maxPrice: maxPrice})
      }
      switch(order) {
        case "newest":
          qb.orderBy("book.addedAt", "DESC");
          break;
        case "oldest":
          qb.orderBy("book.addedAt", "ASC");
          break;
        case "cheapest":
          qb.orderBy("book.price", "ASC");
          break;
        case "mostExpensive":
          qb.orderBy("book.price", "DESC");
          break;
      }


      const books = await qb.getRawMany();

      const count = await qb.getCount();

      res.send({ books: books, page, pages: Math.ceil(count / pageSize) });
    })
  );

  router.put("/book/:id", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const {authors, category, description, pages, price, publisher, title, keywords} = req.body;
    let countInStock = parseInt(req.body.countinstock);

    let checkCategory: [] = await getConnection().query(`SELECT * FROM category WHERE "name" = '${category}'`);
    let checkPublisher: [] = await getConnection().query(`SELECT * FROM publisher WHERE "name" = '${publisher}'`);

    if(checkCategory.length === 0)
        {
          await getConnection()
          .query(`INSERT INTO category ("name") VALUES ('${category}')`);
        }
        const getCategory = await getConnection()
        .query(`SELECT * FROM category WHERE "name"='${category}'`);

        if(checkPublisher.length === 0)
        {
          await getConnection()
          .query(`INSERT INTO publisher ("name") VALUES ('${publisher}')`);
        }
        const getPublisher = await getConnection()
        .query(`SELECT * FROM publisher WHERE "name"='${publisher}'`);

    await getConnection().query(`DELETE FROM author_books_book WHERE "bookId" = ${bookId}`);

    if(authors)
    authors.map(async (item: {id: Number, firstName: string, lastName: string}) => {
      let checkAuthor: [] = await getConnection().query(`SELECT * FROM author WHERE "first_name" = '${item.firstName}' AND "last_name"='${item.lastName}'`);
      if (checkAuthor.length === 0)
      {
        await getConnection()
        .query(`INSERT INTO author ("first_name", "last_name") VALUES ('${item.firstName}', '${item.lastName}');`);
      }
      let getAuthor = await getConnection().query(`SELECT * FROM author WHERE "first_name" = '${item.firstName}' AND "last_name"='${item.lastName}'`);
      await getConnection()
      .query(`INSERT INTO author_books_book ("authorId", "bookId") VALUES (${getAuthor[0].id}, ${bookId})`);
    });

    const updateResult = await getConnection()
    .query(`UPDATE book SET category_id = $1, publisher_id = $2, title = $3, pages = $4, price = $5, 
    countinstock = $6, description = $7, keywords = $8 WHERE id = $9`, 
    [getCategory[0]?.id, getPublisher[0]?.id, title, pages, price, countInStock, description, keywords, bookId]);

    res.json(updateResult);
  }));

  router.post(
    "/books",
    isAuth,
    isSellerOrAdmin,
    expressAsyncHandler(async (req, res) => {
      const {title,
        pages,
        price,
        photo,
        category,
        publisher,
        authors,
        countinstock,
        description,
        keywords} = req.body;


      const checkBook: [] = await getConnection()
      .query(`SELECT * FROM book WHERE "title" = '${title}' AND "description" = '${description}' AND "pages" = ${pages}`);

      if(checkBook.length === 0)
      {
        let checkCategory: [] = await getConnection().query(`SELECT * FROM category WHERE "name" = '${category}'`);
        let checkPublisher: [] = await getConnection().query(`SELECT * FROM publisher WHERE "name" = '${publisher}'`);

        if(checkCategory.length === 0)
        {
          await getConnection()
          .query(`INSERT INTO category ("name") VALUES ('${category}')`);
        }
        const getCategory = await getConnection()
        .query(`SELECT * FROM category WHERE "name"='${category}'`);

        if(checkPublisher.length === 0)
        {
          await getConnection()
          .query(`INSERT INTO publisher ("name") VALUES ('${publisher}')`);
        }
        const getPublisher = await getConnection()
        .query(`SELECT * FROM publisher WHERE "name"='${publisher}'`);

        const book = await getConnection()
        .query(`INSERT INTO book ("title", "pages", "price", "photo", "category_id", "publisher_id", "countinstock", "description", 
        "keywords") VALUES ('${title}', ${pages}, ${price}, '${photo}', ${getCategory[0].id}, ${getPublisher[0].id}, ${countinstock}, 
        '${description}', '${keywords}')`);

        const getBook = await getConnection()
        .query(`SELECT * FROM book WHERE "title" = '${title}' AND "description" = '${description}' AND "pages" = ${pages}`);

        authors.map(async (item: {id: Number, firstName: string, lastName: string}) => {
          let checkAuthor: [] = await getConnection().query(`SELECT * FROM author WHERE "first_name" = '${item.firstName}' AND "last_name"='${item.lastName}'`);
          if (checkAuthor.length === 0)
          {
            await getConnection()
            .query(`INSERT INTO author ("first_name", "last_name") VALUES ('${item.firstName}', '${item.lastName}');`);
          }
          const getAuthor = await getConnection().query(`SELECT * FROM author WHERE "first_name" = '${item.firstName}' AND "last_name"='${item.lastName}'`);
          await getConnection()
          .query(`INSERT INTO author_books_book ("authorId", "bookId") VALUES (${getAuthor[0].id}, ${getBook[0].id})`);
        });

      res.send({ message: "Produkt utworzony", book: book, authors: authors});
      }
      else {
        res.status(401).send({message: "Taki produkt juz istnieje"});
      }
    })
  );

router.get("/books", expressAsyncHandler(async (req, res) => {
  const result = await Book.find();

  res.send(result);
}))

router.get("/book/:bookId", expressAsyncHandler(async (req, res) => {
  
  const bookId = req.params.bookId;
  const book = await 
  getConnection()
  .getRepository(Book)
  .createQueryBuilder("book")
  .leftJoinAndSelect("book.category", "category")
  .leftJoinAndSelect("book.publisher", "publisher")
  .leftJoinAndSelect("book.authors", "bookAuthor")
  .where("book.id = :id", {id: bookId})
  .getOne();

  const averageRate = await getConnection()
  .query(`SELECT AVG(rating) as averageRating FROM review WHERE book_id=$1`, [bookId]);

  const reviews = await getConnection()
  .query(`SELECT * FROM review WHERE book_id=$1`, [bookId]);

  const countReviews = await getConnection()
  .query(`SELECT COUNT(*) FROM review WHERE book_id=$1`, [bookId]);

  res.send({book, averageRate, reviews, countReviews})
}
));

router.get("/book/:bookId/:userId", expressAsyncHandler(async (req, res) => {
  
  const bookId = req.params.bookId;
  const userId = req.params.userId;
  const book = await 
  getConnection()
  .getRepository(Book)
  .createQueryBuilder("book")
  .leftJoinAndSelect("book.category", "category")
  .leftJoinAndSelect("book.publisher", "publisher")
  .leftJoinAndSelect("book.authors", "bookAuthor")
  .where("book.id = :id", {id: bookId})
  .getOne();

  const averageRate = await getConnection()
  .query(`SELECT AVG(rating) as averageRating FROM review WHERE book_id=$1`, [bookId]);

  const reviews = await getConnection()
  .query(`SELECT * FROM review WHERE book_id=$1`, [bookId]);

  const countReviews = await getConnection()
  .query(`SELECT COUNT(*) FROM review WHERE book_id=$1`, [bookId]);

  let publishedReviewsByUser = {};
  if(userId !== null)
  {
    publishedReviewsByUser = await getConnection()
    .query(`SELECT * FROM review WHERE book_id=$1 AND user_id=$2`, [bookId, userId]);
  }

  res.send({book, averageRate, reviews, countReviews, publishedReviewsByUser});
}));

router.delete("/book/:id", 
isAuth,
isSellerOrAdmin, 
expressAsyncHandler(async (req, res) => {

  const bookId = req.params.id;

  await getConnection()
  .query(`DELETE FROM suborder WHERE book_id = $1`, [bookId]);

  await getConnection()
  .query(`DELETE FROM author_books_book WHERE "bookId" = $1`, [bookId]);

  await getConnection()
  .query(`DELETE FROM book_authors_author WHERE "bookId" = $1`, [bookId]);

  await getConnection()
  .query(`DELETE FROM review WHERE book_id = $1`, [bookId]);

  const book = await getConnection()
  .query(`DELETE FROM book WHERE id=$1`, [bookId]);

  res.send(book);
}));

export { router as bookRouter };
