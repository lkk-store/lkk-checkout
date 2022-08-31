const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(`${process.env.key}`);
const express = require('express');
const app = express();
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());      // if needed

const YOUR_DOMAIN = 'https://checkout.lkk-store.com';

app.post('/create-checkout-session', async (req, res) => {

  var keys = Object.keys(req.body);

  var lookup = {
    tshirt360: 'price_1L1p4pLWOuW7oqJ6xbmkJASg',
    tshirt320: 'price_1L58s9LWOuW7oqJ67uvMmcPM',
    tshirt280: 'price_1LcrSjLWOuW7oqJ6LmxBMevk',
    sticker: 'price_1L5QeALWOuW7oqJ6pgWR5TkG'
  }

  // var lookup = {
  //   tshirt360: "price_1L59VcLWOuW7oqJ6GLLyHMc3",
  //   tshirt320: "price_1L5WwsLWOuW7oqJ6qdmGFsA3",
  //   sticker: "price_1L5WxNLWOuW7oqJ6OmH7EaBw"
  // }

  var line_items = [];
  keys.forEach(function(d){
    if (+req.body[d] > 0) {
      line_items.push({
        price: lookup[d],
        quantity: +req.body[d]
      })
    }
  })

  console.log(line_items)

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    phone_number_collection: {
        enabled: true,
      },
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: "https://www.lkk-store.com",
    automatic_tax: {enabled: false},
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));