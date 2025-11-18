const express = require ("express")
const router = express.Router();
const { pedidosController } = require("../controllers/pedidosController");

// GET /pedidos -> lista todos os pedidos 
router.get("/pedidos", pedidosController.listarPedidos);

//POST /pedidos -> cria um novo pedido
router.post("/pedidos", pedidosController.criarPedidos);

//PUT /pedidos -> atualiza um pedido
router.put("/pedidos/:idPedidos", pedidosController.atualizarPedido);

//DELETE /pedidos -> deleta um pedido
router.delete("/pedidos/:idPedidos", pedidosController.deletarPedido);

module.exports = {pedidosRoutes: router};

