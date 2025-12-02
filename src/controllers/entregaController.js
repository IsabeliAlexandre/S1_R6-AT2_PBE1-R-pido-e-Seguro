const { entregaModel } = require("../models/entregaModel");
const {sql, getConnection} = require ("../config/db");
const { pedidosModel } = require("../models/pedidosModel");

// ---------------------
// LISTAR TODOS OS CLIENTES 
// GET /clientes
// ---------------------

const entregaController = {
     /**
     * Controlador que lista todos os pedidos do banco de dados 
     * 
     * @param {object} req - Objeto de requisição (recebido pelo cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} - Retorna uma resposta JSON com lista de produtos
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar os pedidos  
     */

    listarEntrega: async(req,res) =>{
        try {
            const{idEntrega} = req.query;

            if (idEntrega) {
                if (idEntrega.length != 36) {
                    return res.status(400).json({ erro: 'ID da entrega inválido!🚨' });
                }
                const entrega = await entregaModel.buscarUm(idEntrega);
                return res.status(200).json(entrega);
            }

            const entregas = await entregaModel.buscarTodos();
            res.status(200).json(entregas);

        } catch (error) {
            console.error('Erro ao buscar entrega:', error);
            res.status(500).json({ message: 'Erro! Ocorreu um erro ao buscar sua entrega🚨' });
        }
    },

    // ---------------------
    // CRIAR UMA NOVA 
    // POST /entregas
    /*
        {
            idPedido: "3312F93B-1BE4-407C-AC7D-0935DA964B2A"
            statusEntrega: "Calculado, em transito, entregue ou cancelado"
        }
    */
    // ---------------------

    criarEntrega: async(req, res) =>{
        try {
            const pool = await getConnection();
            const {idPedido, statusEntrega} = req.body;

            let querySQL = 'SELECT tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido FROM PEDIDOS WHERE idPedido = @idPedido';

            let result = await pool.request()
            .input('idPedido', sql.UniqueIdentifier, idPedido)
            .query(querySQL);

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: "Ops! Pedido não encontrado!" });
            }

            const calculo = result.recordset[0]; // pega o resultado

            // valor base
            let distancia = calculo.distanciaPedido * calculo.valor_KmPedido;
            let peso = calculo.pesoPedido * calculo.valor_KgPedido;

            let valorBase = distancia + peso;
            let valorTotal =  valorBase;

            // acréscimo (urgente ou normal)
            let acrescimo = 0;

            if(calculo.tipo_EntregaPedido.toLowerCase() === "urgente"){ 
                acrescimo = valorTotal * 0.2;
            }

            valorTotal = valorTotal + acrescimo;

            // desconto (caso o valor passar de 500 reais)
            let desconto = 0;

            if (valorBase > 500){
                (desconto = valorBase * 0.1);
            }

            valorTotal = valorBase - desconto

            // taxa (se pesar mais de 50kg)
            let taxaAdicional = 0;
            if(calculo.pesoPedido > 50){
                taxaAdicional = 15;
            }

            valorTotal = valorTotal + taxaAdicional - desconto;

            console.log({valorTotal});

           
            await entregaModel.inserirEntrega(idPedido, distancia, peso, acrescimo, desconto, taxaAdicional, valorTotal, statusEntrega);
            res.status(201).json({message: 'Entrega cadastrada com sucesso!🥳'});

        } catch (error) {
            console.error('Erro ao criar entrega:', error);
            res.status(500).json({ message: 'Erro ao criar entrega!🚨' });
        }
    },


    // ---------------------
    // ATUALIZAR UMA ENTREGA
    // PUT /entregas
    /*
        {
		"statusEntrega": "Cancelado"
	    }
    */
    // ---------------------

    atualizarEntrega: async(req, res) => {
        try {
            const { idPedido } = req.params;
            const { distanciaEntrega, pesoEntrega, acrescimoEntrega, descontoEntrega, taxaEntrega, valor_finalEntrega, statusEntrega } = req.body;

            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!🚨" });
            }

            const entrega = await entregaModel.buscarUm(idPedido);

            if (!entrega || entrega.length === 0) {
                return res.status(404).json({ erro: "Entrega não encontrada!🚨" });
            }

            const entregaAtual = entrega[0];

            const distanciaEntregaAtualizado = distanciaEntrega ?? entregaAtual.distanciaEntrega;
            const pesoEntregaAtualizado = pesoEntrega ?? entregaAtual.pesoEntrega;
            const acrescimoEntregaAtualizado = acrescimoEntrega ?? entregaAtual.acrescimoEntrega;
            const descontoEntregaAtualizado = descontoEntrega ?? entregaAtual.descontoEntrega;
            const taxaEntregaAtualizado = taxaEntrega ?? entregaAtual.taxaEntrega;
            const valor_finalEntregaAtualizado = valor_finalEntrega ?? entregaAtual.valor_finalEntrega;
            const statusEntregaAtualizado = statusEntrega ?? entregaAtual.statusEntrega;

            await entregaModel.atualizarEntrega(idPedido, distanciaEntregaAtualizado, pesoEntregaAtualizado, acrescimoEntregaAtualizado, descontoEntregaAtualizado, taxaEntregaAtualizado, valor_finalEntregaAtualizado, statusEntregaAtualizado);

            res.status(200).json({ message: 'Entrega atualizada com sucesso!🥳' });

        } catch (error) {
            console.error('Erro ao atualizar entrega:', error);
            res.status(500).json({ message: 'Erro ao atualizar dados entrega!🚨' });
        }
    },

        // ---------------------
    // DELETAR UMA  ENTREGA
    // DELETE /entregas
    /*
       colocar o ID no insomnia.
    */
    // ---------------------

    deletarEntrega: async (req,res) =>{
        try {
            const { idEntrega } = req.params;
            const entrega = await entregaModel.buscarUm(idEntrega);

            if (!entrega || entrega.length === 0) {
                return res.status(404).json({ erro: 'Entrega não encontrada!🚨' });
            }
            await entregaModel.deletarEntrega(idEntrega);
            res.status(200).json({ message: 'Entrega deletada com sucesso!🥳' });

        } catch (error) {
            console.error('Erro ao deletar entrega:', error);
            res.status(500).json({ error: 'Erro no servidor ao deletar entrega🚨' });
        }
    }
}

module.exports = {entregaController};