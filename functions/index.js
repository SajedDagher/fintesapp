const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")("sk_test_51RClrnCyfRbLEC5Z7ka25pShMtB9S5Ead9ghvNjGBxL5WhHPP7KlU42qhDZV7spw7aAnHImDPPJW1wznLNNlyLta00xzymfVcA");

admin.initializeApp();

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).send({ error: error.message });
  }
});
