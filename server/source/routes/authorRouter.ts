import e from 'express';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getConnection } from 'typeorm';
import { isAdmin, isAuth, isSellerOrAdmin } from '../../utils';
import EndpointsController from '../controllers/EndpointsController';
import { Author } from '../entity/Author';
import { SubOrder } from '../entity/SubOrder';
import { Users } from '../entity/Users';
import { Purchase } from './../entity/Purchase';

const router = express.Router();

router.get('/authors', expressAsyncHandler(async (req, res) => {
    const firstName = req.query.firstName || '';
    const lastName = req.query.lastName || '';
    const data = await getConnection().query(`SELECT id, first_name, last_name FROM author WHERE first_name = '${firstName}' OR last_name = '${lastName}' LIMIT 15`);
    //let data;
    // if((firstName || lastName) !== '')
    // {
    //   data = await getConnection().query(`SELECT id, first_name, last_name FROM author WHERE first_name = '${firstName}' OR last_name = '${lastName}' LIMIT 15`);
    // }
    // else {
    //   data = []
    // }
    res.json({authors: data});
}));

router.get(
    "/users",
     isAuth,
     isAdmin,
    expressAsyncHandler(async (req, res) => {

    const users = await Users.find();
  
      res.send(users);
    })
  );

  router.get(
    "/order/summary",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const ordersThisMonth = await getConnection()
      .query(`SELECT COUNT(id) FROM purchase WHERE EXTRACT(month from paid_at) = EXTRACT (month from now())`);
  
      const users = await getConnection()
      .getRepository(Users)
      .createQueryBuilder()
      .getCount();
  
      const salesThisMonth = await getConnection()
      .query(`select SUM(total_price) FROM purchase WHERE EXTRACT(month from paid_at) = EXTRACT (month from now())`);
  
  
      const productCategories = await getConnection()
      .query(`select count(book.id), category.name from book LEFT JOIN category on book.category_id=category.id group by category.name`);

      const salesByDay = await getConnection()
      .query(`select sum(total_price) total_earnings, EXTRACT(day FROM paid_at) day_of_month from purchase WHERE EXTRACT(month FROM paid_at) = EXTRACT(month FROM now()) GROUP BY EXTRACT(day FROM paid_at);`);

      res.send({ users, ordersThisMonth, salesThisMonth, productCategories, salesByDay});
    })
  );

  router.get("/ordersList", isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {

    const pageSize = 5;
    const pageNumber = Number(req.query.pageNumber) || 1;

    const qb = await getConnection()
      .getRepository(Purchase)
      .createQueryBuilder("purchase")
      .leftJoinAndSelect("purchase.customer", "customer")
      .leftJoinAndSelect("customer.users", "user")
      .orderBy("purchase.issuedAt", "DESC")
      .offset((pageSize * pageNumber) - pageSize)
      .limit(pageSize);

    const orders = await qb.getMany();

    const count = await qb.getCount();
  
    res.send({orders: orders, page: pageNumber, pages: Math.ceil(count / pageSize) });
  }));

export { router as authorRouter };
