import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createQueryBuilder, getConnection } from 'typeorm';
import { isAuth, isSellerOrAdmin } from '../../utils';
import EndpointsController from '../controllers/EndpointsController';
import { Purchase } from '../entity/Purchase';
import { Category } from './../entity/Category';

const router = express.Router();

router.get('/categories', expressAsyncHandler(async (req, res) => {
    const data = await getConnection()
    .createQueryBuilder()
    .select("name")
    .from(Category, "name")
    .getMany();
    res.status(200).json(data);
}));

router.post('/api/category', expressAsyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = Category.create({
        name: name
    });

    await category.save();

    res.json(category);
}));

export {router as categoryRouter};