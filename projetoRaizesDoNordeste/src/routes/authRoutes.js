const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Função de registro de cliente
async function register(data) {
  const hash = await bcrypt.hash(data.senha, 10);

  const user = await prisma.usuarios.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha_hash: hash,
      perfil: 'Cliente'
    }
  });

  return user;
}

// Função de Log In de cliente
async function login(email, senha) {
  const user = await prisma.usuarios.findUnique({
    where: { email }
  });

  // Se as credenciais estão incorretas, mostra mensagem de erro.
  if (!user) {
    throw new Error('Usuário não existe');
  }

  const passwordMatch = await bcrypt.compare(senha, user.senha_hash);

  // Se a senha está incorreta, mostra mensagem de erro.
  if (!passwordMatch) {
    throw new Error('Senha incorreta');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      perfil: user.perfil
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, user };
}

module.exports = {
  register,
  login
};const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;