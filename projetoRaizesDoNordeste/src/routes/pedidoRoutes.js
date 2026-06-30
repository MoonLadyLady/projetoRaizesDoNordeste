const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const pedidoController = require('../controllers/pedidoController');

router.post('/', authMiddleware, pedidoController.criarNovaEntrada);

module.exports = router;