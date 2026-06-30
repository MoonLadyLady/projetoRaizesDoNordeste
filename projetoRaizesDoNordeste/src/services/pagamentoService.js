const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar pagamento.
async function realizarPagamento(pedidoId, valor) {
  return await prisma.pagamentos.create({
    data: {
      pedido_id: pedidoId,
      valor,
      status: 'Aprovado',
      transacao_externa: 'MOCK-' + Date.now()
    }
  });
}

module.exports = { realizarPagamento };