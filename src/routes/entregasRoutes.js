const express = require ("express")
const router = express.Router();
const { entregaController } = require("../controllers/entregaController");

// GET /entregas -> lista todos as entregas
router.get("/entregas", entregaController.listarEntrega);

//POST /entrega -> cria uma nova entrega
router.post("/entregas", entregaController.criarEntrega);

//PUT /entrega -> atualiza uma entrega 
router.put("/entregas/:idEntrega", entregaController.atualizarEntrega);

//DELETE /entrega -> deleta uma entrega
router.delete("/entregas/:idEntrega", entregaController.deletarEntrega);

module.exports = {entregasRoutes: router};
