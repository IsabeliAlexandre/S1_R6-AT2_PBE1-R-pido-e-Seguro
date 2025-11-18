const { clienteModel } = require("../models/clienteModel");

// ---------------------
// LISTAR TODOS OS CLIENTES 
// GET /clientes
// ---------------------


const clienteController = {
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: 'Erro! O id que você colocou está inválido!🚨' });
                }

                const CLIENTES = await clienteModel.buscarUm(idCliente)
                return res.status(200).json(CLIENTES)

            }
            const CLIENTES = await clienteModel.buscarTodos();
            res.status(200).json(CLIENTES)

        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            res.status(500).json({ message: 'Ops! Erro ao buscar o cliente desejado🚨!' });
        }
    },

    // ---------------------
    // CRIAR UM NOVO CLIENTE
    // POST /clientes 
    /*
        {
            "nomeCliente": "nome",
            "cpfCliente": "00000000000",
            "telefoneCliente": "12123451234",
            "emailCliente": "marianinhada.silva@email.com"
            "enderecoCliente": "Logradouro, Número, Bairro, Cidade, Estado, CEP"
        }
    */
    // ---------------------

    criarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (nomeCliente == undefined || cpfCliente == undefined || telefoneCliente == undefined || emailCliente == undefined || enderecoCliente == undefined) {
                return res.status(400).json({ erro: 'Erro! Os campos obrigatórios não foram preenchidos' });
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente);
            res.status(201).json({ message: 'Cliente cadastrado com sucesso! 🥳' });

        } catch (error) {
            console.error('Ops! Erro ao cadastrar cliente!', error);
            res.status(500).json({ erro: 'Houve um problema! Erro no servidor ao cadastrar cliente. Ou esse cliente já existe😉.' });
        }
    },


    
    atualizarCliente: async (req, res) => {
        try {
            const {idCliente} = req.params;
            const {nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "Parece que o id do Cliente inválido!" });
            }

            const cliente = await clienteModel.buscarUm(idCliente)
            if (!cliente || cliente.length === 0) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }
            const clienteAtual = cliente[0];

            const nomeClienteAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfClienteAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
            const telefoneClienteAtualizado = telefoneCliente ?? clienteAtual.telefoneCliente;
            const emailClienteAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const enderecoClienteAtualizado = enderecoCliente ?? clienteAtual.enderecoCliente;

            await clienteModel.atualizarCliente(idCliente, nomeClienteAtualizado, cpfClienteAtualizado, telefoneClienteAtualizado, emailClienteAtualizado, enderecoClienteAtualizado);

            res.status(200).json({ message: 'Cliente atualizado com sucesso!' })


        } catch (error) {
            console.error("Erro ao atualizar os dados do cliente!", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" })
        }
    },
    

    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "Verifique se o id do Cliente está correto." });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length === 0) {
                return res.status(404).json({ erro: "Ops!Cliente não encontrado" });
            }

            await clienteModel.deletarCliente(idCliente)
            res.status(200).json({ message: "Cliente deletado com sucesso!" })
        } catch (error) {
            console.error("Erro ao deletar o cliente", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" });
        }
    }
}

module.exports = { clienteController };