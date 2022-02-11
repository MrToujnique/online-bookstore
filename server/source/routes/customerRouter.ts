import express from 'express';
import EndpointsController from '../controllers/EndpointsController';
import { Customer } from '../entity/Customer';

const router = express.Router();

router.post('/api/customer', async (req, res) => {
    const { fullName, address, city } = req.body;

    const customer = Customer.create({
        fullName: fullName,
        address: address,
        city: city
    });

    await customer.save();

    return res.json(customer);
});

export { router as customerRouter };
