const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAuthToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

function signDownloadToken(payload) {
  return jwt.sign(payload, env.downloadTokenSecret, {
    expiresIn: `${env.downloadTokenExpiresMin}m`
  });
}

function verifyDownloadToken(token) {
  return jwt.verify(token, env.downloadTokenSecret);
}

module.exports = {
  signAuthToken,
  verifyAuthToken,
  signDownloadToken,
  verifyDownloadToken
};
