const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAuthToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');

async function register(payload) {
  const existing = await userModel.findUserByEmail(payload.email);
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await hashPassword(payload.password);
  const user = await userModel.createUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
    role: payload.role || 'reader'
  });

  const token = signAuthToken({ id: user.id, role: user.role, email: user.email });
  return { user, token };
}

async function login({ email, password }) {
  const user = await userModel.findUserByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);
  if (user.is_suspended) throw new AppError('User account is suspended', 403);

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = signAuthToken({ id: user.id, role: user.role, email: user.email });
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

module.exports = { register, login };
