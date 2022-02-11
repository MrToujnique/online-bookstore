import express from 'express';
import { isAdmin, isAuth } from '../../utils';
import { Customer } from '../entity/Customer';
import { Purchase } from './../entity/Purchase';
import { isSellerOrAdmin } from './../../utils';
import expressAsyncHandler from 'express-async-handler';
import { SubOrder } from './../entity/SubOrder';
import { getConnection } from 'typeorm';

const router = express.Router();

router.get('/api/purchases', async (req, res) => {
    const data = await Purchase.find({ select: ['id', 'issuedAt'] });
    return res.json(data);
});

router.post('/api/purchase/:customerId', async (req, res) => {
    const { customerId } = req.params;

    const customer = await Customer.findOne(parseInt(customerId));

    const purchase = await Purchase.create({ customer: customer });

    await purchase.save();

    return res.json(purchase);
});

router.get("/",
isAuth,
isSellerOrAdmin,
expressAsyncHandler(async (req: any, res: any) => {
    const orders = await Purchase.find();

    res.send(orders);
}
)
);

router.get(
    "/mine",
    isAuth,
    expressAsyncHandler(async (req: any, res: any) => {
      const orders = await Purchase.find({where: {id: req.body.customerId}});
      res.send(orders);
    })
  );


router.get(
    "/:id",
    isAuth,
    expressAsyncHandler(async (req: any, res: any) => {
      const order = await SubOrder.find({where: {id: req.params.id}, relations: ["purchase"]});
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: "Nie znaleziono zamówienia" });
      }
    })
  );

  
  router.delete(
    "/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req: any, res: any) => {
      const order = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Purchase)
      .where("id = :id", {id: req.params.id})
      .execute();

      if (order) {
        res.send({ message: "Zamówienie usunięte", order: order });
      } else {
        res.status(404).send({ message: "Nie znaleziono zamówienia" });
      }
    })
  );

export { router as purchaseRouter };
