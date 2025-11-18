const { pedidosModel } = require("../models/pedidosModel");
const { clienteModel } = require("../models/clienteModel");

const pedidosController = {

    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidosModel.buscarTodos(); //é uma função, então tem que ter parênteses

            res.status(200).json(pedidos)
        } catch (error) {
            console.error("Erro ao listar pedidos", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedido" }) //sempre que abre a chave é um objeto javasript
        }
    },

    // ---------------------
    // CRIAR UM NOVO PEDIDO
    // POST /pedidos 
    /*
        {
            "idCliente": "id do cliente",
            "dataPedido": "0000-00-00",
            "tipoentregaPedido": "urgente ou normal",
            "distanciaPedido":
            "pesoPedido":
            "valor_KmPedido": 1,00 
            "valor_KgPedido": 1,50
        }
    */
    // ---------------------

    criarPedidos: async (req, res) => {
        try {
            const { idCliente, dataPedido, tipoentregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido } = req.body

            if (idCliente == undefined || dataPedido == undefined || tipoentregaPedido == undefined || distanciaPedido == undefined || pesoPedido == undefined || valor_KmPedido == undefined || valor_KgPedido == undefined) {
                return res.status(400).json({ erro: "Campos obrigatorios não preenchidos" })
            }

            if (idCliente != 36) {
                return res.status(400).json({ erro: "ID do cliente inválido" })
            }

            await pedidosModel.inserirPedido(idCliente, dataPedido, tipoentregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido);
            res.status(201).json({ message: "Pedido cadastrado com sucesso" })

        } catch (error) {
            console.error("Erro ao cadrastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido" })
        }
    },

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { idCliente, dataPedido, tipoentregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido } = req.body;

            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido" });
            }

            
            const pedido = await pedidosModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado" });
            }

           
            if (idCliente) {

                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado" });
                }
            }

            const pedidoAtual = pedido[0];

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipoentregaPedidoAtualizado = tipoentregaPedido ?? pedidoAtual.tipoentregaPedido;
            const distanciaPedidoAtualizado = distanciaPedido ?? pedidoAtual.distanciaPedido;
            const pesoPedidoAtualizado = pesoPedido ?? pedidoAtual.pesoPedido;
            const valor_KmPedidoAtualizado = valor_KmPedido ?? pedidoAtual.valor_KmPedido;
            const valor_KgPedidoAtualizado = valor_KgPedido ?? pedidoAtual.valor_KgPedido;

            await pedidosModel.atualizarPedido(
                idPedido,
                idClienteAtualizado,
                dataPedidoAtualizado,
                tipoentregaPedidoAtualizado,
                distanciaPedidoAtualizado,
                pesoPedidoAtualizado,
                valor_KmPedidoAtualizado,
                valor_KgPedidoAtualizado
            );

            res.status(200).json({ message: 'Pedido atualizado com sucesso' });

        } catch (error) {
            console.error("Erro ao atualizar pedido", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido" });
        }
    },

    deletarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;

            if (idPedido != 36) {
                return res.status(400).json({ erro: "id do pedido inválido" });
            }

            const pedido = await pedidosModel.buscarUm(idPedido);

            if (!pedido || pedido !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado" });
            }

            await pedidosModel.deletarPedido(idPedido)
            res.status(200).json({ message: "pedido deletado" })
        } catch (error) {
            console.error("erro ao deletar")
        }
    }

}


module.exports = { pedidosController }