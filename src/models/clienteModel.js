const { sql, getConnection } = require("../config/db");

const clienteModel = {

    // ---------------------
    // CONFERIR SE HÁ UM CPF EXISTENTE
    // na hora do cadastro, se o cpf existir, dará o erro previsto.
    // ---------------------

     buscarCpf: async (cpfCliente) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let querySQL = 'SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente';

            const result = await pool.request()
            .input ('cpfCliente', sql.Char(14), cpfCliente)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar cpf:', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    // ---------------------
    // CONFERIR SE HÁ UM EMAIL EXISTENTE
    // na hora do cadastro, se o email existir, dará o erro previsto.
    // ---------------------


    buscarEmail: async (emailCliente) => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let querySQL = 'SELECT * FROM Clientes WHERE emailCliente = @emailCliente';

            const result = await pool.request()
            .input ('emailCliente', sql.VarChar(50), emailCliente)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar email:', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    buscarTodos: async () => {
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let querySQL = 'SELECT * FROM CLIENTES';

            const result = await pool.request().query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error('Ops! Erro ao buscar os clientes🚨:', error);
            throw error; // Passa o erro para o controler tratar; o catch captura o erro 
        }
    },

    // ---------------------
    // Permite que busque um cliente só
    // ---------------------

    buscarUm: async (idCliente) => { // busca um cliente
        try {
            const pool = await getConnection(); // Cria conexão com o Banco de Dados

            let querySQL = 'SELECT * FROM CLIENTES WHERE idCliente = @idCliente';

            const result = await pool
            .request()
            .input ('idCliente', sql.UniqueIdentifier, idCliente)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Ops! Erro ao buscar cliente procurado🚨:', error);
            throw error; // Passa o erro para o controler tratar
        }
    },

    // ---------------------
    // INSERIR UM NOVO CLIENTE
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


    inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = 'INSERT INTO CLIENTES (nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @enderecoCliente)';

            await pool.request()
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input(`cpfCliente`, sql.Char(11), cpfCliente)
                .input('telefoneCliente', sql.VarChar(15), telefoneCliente)
                .input(`emailCliente`, sql.Char(200), emailCliente)
                .input('enderecoCliente', sql.VarChar(500), enderecoCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Ops! Erro ao inserir cliente!🚨', error);
            throw error; // Passa o erro para o controle tratar 

        }

    },

    // ---------------------
    // ATUALIZAR UM CLIENTE
    // PUT /clientes 
    /*
        {
	 ex: "emailCliente": "nicadm.nabby@gmail.com"
        }
    */
    // ---------------------

    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = 'UPDATE CLIENTES SET nomeCliente = @nomeCliente, cpfCliente = @cpfCliente, telefoneCliente = @telefoneCliente, emailCliente = @emailCliente, enderecoCliente = @enderecoCliente WHERE idCliente = @idCliente';

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input('cpfCliente', sql.Char(11), cpfCliente)
                .input('telefoneCliente', sql.VarChar(15), telefoneCliente)
                .input('emailCliente', sql.Char(200), emailCliente)
                .input('enderecoCliente', sql.VarChar(500), enderecoCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Ops! Erro ao atualizar cliente!🚨', error);
            throw error;
        }
    },

    // ---------------------
    // DELETAR O CLIENTE
    // DELETE /cliente
    /*
        colocar o ID no routes. 
    */
    // ---------------------

    deletarCliente: async (idCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = 'DELETE FROM CLIENTES WHERE idCliente = @idCliente';

            await pool.request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Ops! Erro ao deletar cliente!🚨', error);
            throw error;
        }
    }

}

module.exports = { clienteModel }
