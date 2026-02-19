const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'unsafe-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key',
  paymentMode: process.env.PAYMENT_MODE || 'mock',
  defaultCommissionPercent: Number(process.env.DEFAULT_COMMISSION_PERCENT || 30),
  downloadTokenSecret: process.env.DOWNLOAD_TOKEN_SECRET || 'unsafe-download-secret',
  downloadTokenExpiresMin: Number(process.env.DOWNLOAD_TOKEN_EXPIRES_MIN || 30),
  maxDownloadsPerPurchase: Number(process.env.MAX_DOWNLOADS_PER_PURCHASE || 3),
  baseUrl: process.env.BASE_URL || 'http://localhost:4000'
};
