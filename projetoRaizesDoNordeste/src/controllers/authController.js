const authService = require('../services/authService');

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login
};