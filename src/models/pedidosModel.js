const { sql, getConnection } = require("../config/db")

const pedidosModel = {

     buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = `SELECT * FROM PEDIDOS
            `;

            const result = await pool.request()
            .query(querySQL);

            return result.recordset
        } catch (error) {
            console.error("Erro ao buscar pedidos", error);
            throw error;
        }
     },

    buscarUm: async (idPedido) => {
        try {
            
            const pool = await getConnection();
            const querySQL = "SELECT * FROM PEDIDOS WHERE idPedido = @idPedido";

            const result= await pool.request()
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .query(querySQL);

            return result.recordset 

        } catch (error) {
             console.error("Erro ao buscar o pedido", error);
            throw error;
        }
     },
    
     inserirPedido: async (idCliente, dataPedido, tipoEntrega, distanciaPedido, pesoPedido, valor_KgPedido, valor_KmPedido ) => {
        //{itens} realiza a desustruturação do objeto itens

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //inicia a transação

        try {

            let querySQL = `
            INSERT INTO PEDIDOS (idCliente, dataPedido, tipoentregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido)
            OUTPUT INSERTED.idPedido
            VALUES (@idCliente, @dataPedido, @tipoentregaPedido, @distanciaPedido, @pesoPedido, @valor_KmPedido, @valor_KgPedido)`;

            const result = await transaction.request()
            .input("idCliente", sql.UniqueIdentifier, idCliente)
            .input ("dataPedido", sql.Date, dataPedido)
            .input("tipoEntrega", sql.VarChar(15), tipoEntrega)
            .input("distanciaPedido", sql.Decimal(10,2), distanciaPedido)
            .input ("pesoPedido", sql.Decimal(10,2), pesoPedido)
            .input("valor_KmPedido", sql.Decimal(10,2), valor_KmPedido)
            .input("valor_KgPedido", sql.Decimal(10,2), valor_KgPedido)
            .query(querySQL);

            /* const idPedido = result.recordset[0].idPedido;  //recordset retorna uam lista (array) 
            
            for (const item of itens) {
                const {idProduto, qtdItem} = item;

                querySQL =`

                INSERT INTO ItemPedido (idPedido, idProduto, qtdItem)
                VALUES (@idPedido, @idProduto, @qtdItem)

                `
                await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idProduto", sql.UniqueIdentifier, idProduto)
                .input("qtdItem", sql.Int, qtdItem)
                .query(querySQL);

            } */


            await transaction.commit() //confirma a transação, salva tudo no banco de dados 

        } catch (error) {
            await transaction.rollback() //desfaz tudo caso de erro 
            console.error('Erro ao inserir pedido', error);
            throw error;
        }
        
     },

     atualizarPedido: async (idPedido, idCliente, dataPedido, tipoEntrega, distanciaPedido, pesoPedido, valor_KgPedido, valor_KmPedido ) => {

        try {
             
            const pool = await getConnection();

            const querySQL = `
                UPDATE Pedidos
                SET idCliente = @idCliente,
                    dataPedido = @dataPedido,
                    tipoEntrega = @tipoEntrega
                    distanciaPedido = @distanciaPedido
                    pesoPedido = @pesoPedido
                    valor_KgPedido = @valor_KgPedido
                    valor_KmPedido = @valor_KmPedido 
                WHERE idPedido = @idPedido
                `

            await pool.request()
            .input("idCliente", sql.UniqueIdentifier, idCliente)
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .input("dataPedido", sql.Date, dataPedido)
            .input("tipoEntrega", sql.VarChar(15), tipoEntrega)
            .input("distanciaPedido", sql.Decimal(10,2), distanciaPedido)
            .input ("pesoPedido", sql.Decimal(10,2), pesoPedido)
            .input("valor_KmPedido", sql.Decimal(10,2), valor_KmPedido)
            .input("valor_KgPedido", sql.Decimal(10,2), valor_KgPedido)
            .query(querySQL);
        
        } catch (error) {
            console.error('Erro ao analiar pedido', error);
            throw error;
        }
        
     },

         deletarPedido: async (idPedido) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
        
            let querySQL = `
                DELETE FROM Pedido
                WHERE idPedido = @idPedido
            `

            await transaction.request()
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .query(querySQL);

            querySQL = `
                DELETE FROM Pedidos
                WHERE idPedido = @idPedido
            `
            await transaction.request()
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao deletar o pedido', error);
            throw error;
        }
     }
}

module.exports ={pedidosModel}
