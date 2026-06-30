const pedidoService = require('../services/pedidoService');
const pagamentoService = require('../services/pagamentoService');

async function criarNovaEntrada(req, res) {
  try {
    // Chama função para criar o pedido.
    const pedido = await pedidoService.fazerPedido(
      req.body,
      req.user.id
    );

    // Chama função para realizar o pagamento.
    await pagamentoService.realizarPagamento(
      pedido.id,
      pedido.valor_total
    );

    // Chama função de atualizar status do pedido.
    await pedidoService.atualizarStatus(
      pedido.id,
      'Em prepar'
    );

    // Informa que o pedido foi feito.
    return res.status(201).json({
      message: 'Pedido feito com sucesso',
      pedido
    });

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

module.exports = { criarNovaEntrada };