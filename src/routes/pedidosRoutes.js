const express = require ("express")
const router = express.Router();
const { pedidosController } = require("../controllers/pedidosController");

// GET /pedidos -> lista todos os pedidos 
router.get("/pedidos", pedidosController.listarPedidos);

//POST /pedidos -> cria um novo pedido
router.post("/pedidos", pedidosController.criarPedidos);

router.put("/pedidos/:idPedidos", pedidosController.atualizarPedido);

router.delete("/pedidos/:idPedidos", pedidosController.deletarPedido);

module.exports = {pedidosRoutes: router};

