const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função de registro de usuário
async function register(data) {
  const senhaHash = await bcrypt.hash(data.senha, 10);

  const existeUsuario = await prisma.usuarios.findUnique({
    where: { email: data.email }
  });

  // Se o e-mail inserido já está sendo usado por outro usuário, mostra mensagem de erro.
  if (existeUsuario) {
    throw new Error('E-mail já cadastrado');
  }

  const user = await prisma.usuarios.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha_hash: senhaHash,
      perfil: 'Cliente'
    }
  });

return {
  id: user.id.toString(),
  nome: user.nome,
  email: user.email,
  perfil: user.perfil,
  ativo: user.ativo,
  criado_em: user.criado_em
};

}

// Função de Log in 
async function login(data) {
  const user = await prisma.usuarios.findUnique({
    where: { email: data.email }
  });

  // Se as credenciais estão incorretas, mostra mensagem de erro.
  if (!user) throw new Error('Usuário não existe');

  const validarSenha = await bcrypt.compare(data.senha, user.senha_hash);

  // Se a senha está incorreta, mostra mensagem de erro.
  if (!validarSenha) throw new Error('Senha incorreta');

  const token = jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      perfil: user.perfil
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

 return {
  user: {
    id: user.id.toString(),
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    perfil: user.perfil,
    ativo: user.ativo,
    criado_em: user.criado_em
  },
  token
};
}

module.exports = {
  register,
  login
};