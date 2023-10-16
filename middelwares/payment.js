const express = require("express");
const stripe = require('stripe')("sk_test_51N2CxdApDEYiZYCW9IOgalZhgb2iBKrWLZuPAomPrDMSLRZOieRyJHaKGd4w8arVQTTMVn8BiiAuVqPEdFQZDLoN00OPtbKJSZ");

const router  = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `NICU`,
                    },
                    unit_amount: payment.price,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
    });

    res.json({url:  session.url});
});
module.exports = router;



