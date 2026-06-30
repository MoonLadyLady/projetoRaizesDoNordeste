const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Função para criar pedidos.
async function fazerPedido(data, userId) {
  const pedido = await prisma.pedidos.create({
    data: {
      clienteId: userId,
      unidadeId: data.unidade_id,
      canalPedido: data.canal_pedido,
      formaPagamento: data.forma_pagamento,
      status: 'Aguardando pagamento',
      valor_total: 0
    }
  });

  let total = 0;

  // Verifica se o pedido está correto e em seguida gera o pedido.
  for (const item of data.itens) {
    const produto = await prisma.produtos.findUnique({
      where: { id: item.produto_id }
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    const subtotal = produto.preco * item.quantidade;
    total += subtotal;

    await prisma.pedido_itens.create({
      data: {
        pedidoId: pedido.id,
        produtoId: item.produto_id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal
      }
    });
  }

  // Atualiza o valor total dos pedidos.
  return await prisma.pedidos.update({
    where: { id: pedido.id },
    data: { valor_total: total }
  });
}
async function atualizarStatus(pedidoId, status) {
  return await prisma.pedidos.update({
    where: { id: pedidoId },
    data: { status }
  });
}

module.exports = { fazerPedido };