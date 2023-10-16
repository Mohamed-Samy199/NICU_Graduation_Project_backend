const bookModel = require("../models/books.model")
const moment = require("moment/moment.js");
const stripe = require('stripe')("sk_test_51N2CxdApDEYiZYCW9IOgalZhgb2iBKrWLZuPAomPrDMSLRZOieRyJHaKGd4w8arVQTTMVn8BiiAuVqPEdFQZDLoN00OPtbKJSZ");

const bookNicu = async (req, res) => {
    try {
        const { name, phone, price } = req.body;
        const dateIssued = moment(req.body.dateIssued).format('MM/DD/YYYY');
        const dateReturned = moment(req.body.dateReturned).format('MM/DD/YYYY');

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${name} is book NICU`,
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/measure',
            cancel_url: 'http://localhost:3000/home',
        });
        const pay = { url: session.url }
        console.log(pay.url);
        const book = new bookModel({ name, phone, dateIssued, dateReturned, price, url: session.url })
        const saveBook = await book.save();

        saveBook ? res.status(200).json({ message: "Book Success", saveBook }) : res.status(400).json({ message: "Book Fail" });

    } catch (error) {
        console.error("Can not book nicu:", error);
        res.status(500).json({ message: error.message });
    }
};
const donationNicu = async (req, res) => {
    try {
        const { name, phone, money } = req.body;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${name} is donate for NICU`,
                        },
                        unit_amount: money,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/home',
            cancel_url: 'http://localhost:3000/home',
        });
        const pay = { url: session.url }
        console.log(pay.url);
        const donate = new bookModel({ name, phone, money, url: session.url })
        const saveDonate = await donate.save();

        saveDonate ? res.status(200).json({ message: "Donate Successful", saveDonate }) : res.status(400).json({ message: "Donate Fail" });

    } catch (error) {
        console.error("Can not donate nicu:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookNicu,
    donationNicu
}
