const { sql, getConnection } = require("../config/db")

const pedidosModel = {

    // ---------------------
    // PERMITE QUE BUSQUE TODOS OS PEDIDOS REGISTRADOS.
    // ---------------------

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


     // ---------------------
    // PERMITE QUE BUSQUE APENAS UMA ENTREGA ESPECÍFICA COM O ID.
    // ---------------------

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
    
    // ---------------------
    // INSERIR UMA NOVO PEDIDO
    // POST /pedidos
    /*
        {
	 		"idCliente": "B79ECFE5-A2F3-436D-8322-6989F92E91FB",
            "dataPedido": "2025-12-02",
            "tipo_EntregaPedido": "urgente",
            "distanciaPedido": 20,
            "pesoPedido": 40,
            "valor_KmPedido": 5, 
            "valor_KgPedido": 3
}
    */
    // ---------------------

     inserirPedido: async (idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KgPedido, valor_KmPedido ) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //inicia a transação

        try {

            let querySQL = `
            INSERT INTO PEDIDOS (idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido)
            OUTPUT INSERTED.idPedido
            VALUES (@idCliente, @dataPedido, @tipo_EntregaPedido, @distanciaPedido, @pesoPedido, @valor_KmPedido, @valor_KgPedido)`;

            const result = await transaction.request()
            .input("idCliente", sql.UniqueIdentifier, idCliente)
            .input ("dataPedido", sql.Date, dataPedido)
            .input("tipo_EntregaPedido", sql.VarChar(15), tipo_EntregaPedido)
            .input("distanciaPedido", sql.Decimal(10,2), distanciaPedido)
            .input ("pesoPedido", sql.Decimal(10,2), pesoPedido)
            .input("valor_KmPedido", sql.Decimal(10,2), valor_KmPedido)
            .input("valor_KgPedido", sql.Decimal(10,2), valor_KgPedido)
            .query(querySQL);

            await transaction.commit() //confirma a transação, salva tudo no banco de dados 

        } catch (error) {
            await transaction.rollback() //desfaz tudo caso de erro 
            console.error('Erro ao inserir pedido', error);
            throw error;
        }
        
     },

     // ---------------------
    // ATUALIZAR UM PEDIDO
    // PUT /pedido
    /*
        {
	"tipo_EntregaPedido": "normal"
        }
    */
    // ---------------------

     atualizarPedido: async (idPedido, idCliente, dataPedido, tipo_EntregaPedido, distanciaPedido, pesoPedido, valor_KmPedido, valor_KgPedido ) => {

        try {
             
            const pool = await getConnection();

            const querySQL = `
                UPDATE PEDIDOS
                SET idCliente = @idCliente,
                    dataPedido = @dataPedido,
                    tipo_EntregaPedido = @tipo_EntregaPedido,
                    distanciaPedido = @distanciaPedido,
                    pesoPedido = @pesoPedido,
                    valor_KgPedido = @valor_KgPedido,
                    valor_KmPedido = @valor_KmPedido
                WHERE idPedido = @idPedido
                `

            await pool.request()
            .input("idCliente", sql.UniqueIdentifier, idCliente)
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .input("dataPedido", sql.Date, dataPedido)
            .input("tipo_EntregaPedido", sql.VarChar(15), tipo_EntregaPedido)
            .input("distanciaPedido", sql.Decimal(10,2), distanciaPedido)
            .input ("pesoPedido", sql.Decimal(10,2), pesoPedido)
            .input("valor_KmPedido", sql.Decimal(10,2), valor_KmPedido)
            .input("valor_KgPedido", sql.Decimal(10,2), valor_KgPedido)
            .query(querySQL);
        
        } catch (error) {
            console.error('Erro ao analisar pedido', error);
            throw error;
        }
        
     },

    // ---------------------
    // DELETAR UM PEDIDO
    // DELETE /pedido
    /*
        colocar o ID no routes. 
    */
    // ---------------------

     deletarPedido: async (idPedido) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
        
            let querySQL = `
                DELETE FROM PEDIDOS
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
