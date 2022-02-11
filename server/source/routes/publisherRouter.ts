import express from 'express';
import EndpointsController from '../controllers/EndpointsController';
import { Publisher } from './../entity/Publisher';

const router = express.Router();

router.get('/api/publishers', async (req, res) => {
    const data = await Publisher.find({ select: ['id', 'name'] });
    return res.json(data);
});

router.post('/api/publisher', async (req, res) => {
    const { name } = req.body;

    const publisher = Publisher.create({
        name: name
    });

    await publisher.save();

    return res.json(publisher);
});

export { router as publisherRouter };
