const Stripe = require('stripe');
const env = require('../config/env');

const stripe = new Stripe(env.stripeSecretKey);

async function charge({ amount, currency = 'usd', metadata }) {
  if (env.paymentMode === 'mock') {
    return {
      id: `mock_${Date.now()}`,
      status: 'succeeded',
      amount,
      currency,
      metadata
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true }
  });

  return paymentIntent;
}

module.exports = { charge };
