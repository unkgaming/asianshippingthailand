import Stripe from 'stripe';

// Use placeholder for build, will throw at runtime if actually used without key
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

export default stripe;
