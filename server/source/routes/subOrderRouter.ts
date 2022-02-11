import express from 'express';
import { SubOrder } from './../entity/SubOrder';
import { Purchase } from './../entity/Purchase';
import { Book } from './../entity/Book';
import { isAuth } from '../../utils';
import expressAsyncHandler from 'express-async-handler';
import { Connection, createQueryBuilder, getConnection, getManager, getRepository } from 'typeorm';
import { Customer } from './../entity/Customer';
import { Length } from 'class-validator';
import logging from '../config/logging';
import { isAdmin, isSellerOrAdmin } from './../../utils';
import { Users } from './../entity/Users';

const router = express.Router();

router.get(
  "/order/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await getConnection()
    .getRepository(SubOrder)
    .createQueryBuilder("suborder")
    .leftJoinAndSelect("suborder.purchase", "purchase")
    .leftJoinAndSelect("purchase.customer", "customer")
    .leftJoinAndSelect("suborder.book", "book")
    .leftJoinAndSelect("customer.users", "users")
    .where("purchase.id = :id")
    .setParameters({id: req.params.id})
    .getRawMany();

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Nie znaleziono zamówienia" });
    }
  })
);

router.post(
    "/orders",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      if (req.body.cartItems.length === 0) {
        res.status(400).send({ message: "Koszyk jest pusty" });
      } else {
        const {fullName, address, city, postalCode} = req.body.shippingAddress;
        const {itemsPrice, paymentMethod, shippingPrice, totalPrice} = req.body;
        const {id} = req.body.userInfo;
        const cartItems = req.body.cartItems;
        let customer: Customer;
        const existingCustomer = await Customer.findOne({where: {fullName: fullName, address: address, city: city, postalCode: postalCode}});
        const quantitySum = cartItems.reduce((a: any, c: any) => a + c.quantity, 0);

        if(existingCustomer)
        {
          customer = existingCustomer;
        }
        else {
          customer = new Customer();
          customer.fullName = fullName;
          customer.address = address;
          customer.city = city;
          customer.postalCode = postalCode;
          customer.users = id;
          await getConnection().getRepository(Customer).save(customer);
        }

        const purchase = new Purchase();
        purchase.customer = customer;
        purchase.itemsPrice = itemsPrice;
        purchase.shippingPrice = shippingPrice;
        purchase.totalPrice = totalPrice;
        purchase.paymentMethod = paymentMethod;
        purchase.quantitySum = quantitySum;
        
        const getPurchase = await getConnection().getRepository(Purchase).save(purchase).then(purchase => {
          return purchase;
        });

        const subOrder = new SubOrder();
        subOrder.purchase = purchase;

        const promises = cartItems.map(async (item: any, id: number) => {
          subOrder.quantity = item.quantity;
          subOrder.book = item.book;
          await getConnection()
          .getRepository(SubOrder)
          .createQueryBuilder()
          .insert()
          .into(SubOrder)
          .values([
            {quantity: subOrder.quantity,
            purchase: subOrder.purchase,
            book: subOrder.book
            }
          ])
          .execute();
        });

        const promiseUpdate = cartItems.map(async (item: any) => {
          const updatedCountinstock = item.countinstock - item.quantity;
          await getConnection()
          .getRepository(Book)
          .createQueryBuilder()
          .update(Book)
          .set({countinstock: updatedCountinstock})
          .where("id = :id", {id: item.book})
          .execute();
        })

        await Promise.all(promises);
        await Promise.all(promiseUpdate);
          res.status(201).send({message: "Utworzono nowe zamówienie", order: getPurchase});
      }
    })
  );

  router.get(
    "/orders/mine/:id",
    isAuth,
    expressAsyncHandler(async (req, res) => {

      const orders = await getConnection()
      .getRepository(Purchase)
      .createQueryBuilder("purchase")
      .leftJoinAndSelect("purchase.customer", "customer")
      .leftJoinAndSelect("customer.users", "user")
      .where("user.id = :id")
      .setParameters({id: req.params.id})
      .getMany();

      res.send(orders);
    })
  );

router.put(
    "/orders/:id/pay",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await getConnection()
      .getRepository(Purchase)
      .createQueryBuilder("purchase")
      .where("id = :id")
      .setParameters({id: req.params.id})
      .getRawOne();

      
      if (order) {
        const isPaid = order.purchase_is_paid = true;
        const paidAt = order.purchase_paid_at = new Date(Date.now()).toISOString();
        const updateUser = await getConnection()
        .createQueryBuilder()
        .update(Purchase)
        .set(
          {
            paidAt: paidAt,
            isPaid: isPaid
          }
          )
          .where("id = :id", {id: order.purchase_id})
        .execute();

        const getIdFromUpdate = updateUser.raw.id;

        const updatedOrder = await getConnection()
        .getRepository(Purchase)
        .createQueryBuilder()
        .where("id = :id", {id: getIdFromUpdate})
        .getOne();
        res.send({ message: "Order Paid", order: updatedOrder });
      } else {
        res.status(404).send({ message: "Order Not Found" });
      }
    })
  );

router.delete("/order/:id",
isAuth,
isAdmin,
expressAsyncHandler(async (req, res) => {
  const order = await getConnection()
  .createQueryBuilder()
  .delete()
  .from(SubOrder)
  .where("purchase_id = :id", {id: req.params.id})
  .execute();

  const purchase = await getConnection()
  .createQueryBuilder()
  .delete()
  .from(Purchase)
  .where("id = :id", {id: req.params.id})
  .execute();

  res.send({order, purchase});
}));

router.put(
  "/:id/deliver",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await getConnection()
    .getRepository(Purchase)
    .createQueryBuilder()
    .where("id = :id", {id: req.params.id})
    .getRawOne();
    
    if (order) {
      const isDelivered = true;
      const deliveredAt = new Date().toISOString();

      const updatedOrder = await getConnection()
      .getRepository(Purchase)
      .createQueryBuilder()
      .update(Purchase)
      .set({
        isDelivered: isDelivered, 
        deliveredAt: deliveredAt
      })
      .where("id = :id", {id: order.Purchase_id})
      .execute();
      res.send({ message: "Zatwierdzono wysyłkę", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Nie znaleziono zamówienia" });
    }
  })
);

export { router as subOrderRouter };
