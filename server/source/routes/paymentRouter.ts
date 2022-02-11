import express from "express";
import {v4 as uuidv4} from 'uuid';

const router = express.Router();
const stripe = require("stripe")('Tu należy prowadzić sekretny klucz Stripe API');

router.post("/payment", async (req, res) => {
  
	let error;
	let status;
	try {
	  const { token, order } = req.body;

	  const totalPrice = parseInt(Number(order[0].purchase_total_price * 100).toFixed(2));
  
	  const customer = await stripe.customers.create({
		email: token.email,
		source: token.id
	  });
  
	  const idempotencyKey = uuidv4();
	  const charge = await stripe.charges.create(
		{
		  amount: totalPrice,
		  currency: "PLN",
		  customer: customer.id,
		  receipt_email: token.email,
		  description: `Zamowienie nr: ${order[0].purchase_id}`,
		  shipping: {
			name: token.card.name,
			address: {
			  line1: token.card.address_line1,
			  line2: token.card.address_line2,
			  city: token.card.address_city,
			  country: token.card.address_country,
			  postal_code: token.card.address_zip
			}
		  }
		},
		{
		  idempotencyKey
		}
	  );
	  status = "success";
	} catch (error) {
	  console.error("Error:", error);
	  status = "failure";
	}
  
	res.json({ error, status });
  });

export { router as paymentRouter };