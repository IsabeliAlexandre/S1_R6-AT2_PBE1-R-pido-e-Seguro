const express = require ("express")
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

// GET /clientes -> lista todos os clientes 
router.get("/clientes", clienteController.listarClientes);

//POST /clientes -> cria um novo cliente
router.post("/clientes", clienteController.criarCliente);

//PUT /clientes -> atualiza um cliente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);

//DELETE /clientes -> deleta um cliente
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = {clientesRoutes: router};
