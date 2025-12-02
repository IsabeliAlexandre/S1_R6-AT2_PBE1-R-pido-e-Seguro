const { pedidosModel } = require("../models/pedidosModel");
const { clienteModel } = require("../models/clienteModel");

// ---------------------
// LISTAR TODOS OS CLIENTES 
// GET /clientes
// ---------------------

const pedidosController = {
    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidosModel.buscarTodos();

            res.status(200).json(pedidos)
        } catch (error) {
            console.error("Erro ao listar pedidos", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedido" })
        }
    },

    // ---------------------
    // CRIAR UM NOVO PEDIDO
    // POST /pedidos
    /*
        {
	 		"idCliente": "FE4D8D20-7B53-40B3-8D55-D3AACF8D128F",
            "dataPedido": "2025-11-21",
            "tipo_EntregaPedido": "normal",
            "distanciaPedido": "20",
            "pesoPedido": "10",
            "valor_KmPedido": "5", 
            "valor_KgPedido": "3"
}
    */
    // ---------------------

    criarPedidos: async (req, res) => {
        try {
            const { idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido } = req.body

            if (idCliente == undefined || dataPedido == undefined || tipo_EntregaPedido == undefined || distanciaPedido == undefined || pesoPedido == undefined || valor_KmPedido == undefined || valor_KgPedido == undefined) {
                return res.status(400).json({ erro: "Campos obrigatorios não preenchidos" })
            }

        
            if (!idCliente || idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido" })
            }

            await pedidosModel.inserirPedido(idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido);
            res.status(201).json({ message: "Pedido cadastrado com sucesso" })

        if(isNaN(distanciaPedido,pesoPedido,valor_KmPedido,valor_KgPedido)){
            return res.status(400).json({ erro: "Erro ao cadastrar dados do pedido" })
        }

        } catch (error) {
            console.error("Erro ao cadrastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido" })
        }

    },

    // ---------------------
    // ATUALIZAR O PEDIDO
    // PUT /pedidos
    /*
        {
	"tipo_EntregaPedido": "urgente"
        }
    */
    // ---------------------

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido } = req.body;

            if (idPedido.length != 36) {
                return res.status(400).json({ erro: "ID do pedido inválidoo!" });
            }
        
            const pedido = await pedidosModel.buscarUm(idPedido);
            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!🚨" });
            }
           
            if (idCliente) {
                if ( idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido!🚨" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado!" });
                }
            }

            const pedidoAtual = pedido[0];

            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipo_EntregaPedidoAtualizado = tipo_EntregaPedido ?? pedidoAtual.tipo_EntregaPedido;
            const distanciaPedidoAtualizado = distanciaPedido ?? pedidoAtual.distanciaPedido;
            const pesoPedidoAtualizado = pesoPedido ?? pedidoAtual.pesoPedido;
            const valor_KmPedidoAtualizado = valor_KmPedido ?? pedidoAtual.valor_KmPedido;
            const valor_KgPedidoAtualizado = valor_KgPedido ?? pedidoAtual.valor_KgPedido;

            await pedidosModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado, tipo_EntregaPedidoAtualizado, distanciaPedidoAtualizado, pesoPedidoAtualizado, valor_KmPedidoAtualizado, valor_KgPedidoAtualizado);

            res.status(200).json({ message: 'Pedido atualizado com sucesso!🥳' });

        } catch (error) {
            console.error("Erro ao atualizar pedido", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido!" });
        }
    },

     // ---------------------
    // DELETAR O PEDIDO
    // DELETE /pedidos
    /*
        colocar o ID no routes. 
    */
    // ---------------------

    deletarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;

            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!🚨" });
            }

            const pedido = await pedidosModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!🚨" });
            }

            await pedidosModel.deletarPedido(idPedido)
            res.status(200).json({ message: "Pedido deletado com sucesso!🥳" })
        } catch (error) {
            console.error("Erro ao deletar pedido", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar pedido!" });
        }
    }

}

module.exports = { pedidosController }
