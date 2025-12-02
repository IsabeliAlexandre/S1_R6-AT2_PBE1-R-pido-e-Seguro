const { sql, getConnection } = require("../config/db")

const entregaModel = {

    // ---------------------
    // BUSCA TODOS AS ENTREGAS EXISTENTES
    // ---------------------

     buscarTodos: async() =>{
        try {
            const pool = await getConnection();

            const querySQL = "SELECT * FROM ENTREGA";

            const result = await pool.request()
            .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar entregas", error);
            throw error;
        }
     },

     // ---------------------
    // PERMITE QUE BUSQUE APENAS UMA ENTREGA ESPECÍFICA COM O ID.
    // ---------------------

     buscarUm: async(idEntrega) =>{
         try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM ENTREGA WHERE idEntrega = @idEntrega";

            const result = await pool.request()
            .input("idEntrega", sql.UniqueIdentifier, idEntrega)
            .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar a entrega", error);
            throw error;
        }
     },


    // ---------------------
    // INSERIR UMA NOVA ENTREGA
    // POST /entregas
    /*
        {
	"idPedido": "5DA7FDD9-831C-43EC-B351-CED126BBDB1B",
	"statusEntrega": "entregue"

        }
    */
    // ---------------------

     inserirEntrega: async (idPedido, distanciaEntrega, pesoEntrega, acrescimoEntrega, descontoEntrega, taxaEntrega, valor_finalEntrega, statusEntrega) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            let querySQL = `
            INSERT INTO ENTREGA
            (idPedido, distanciaEntrega, pesoEntrega, acrescimoEntrega, descontoEntrega, taxaEntrega, valor_finalEntrega, statusEntrega)
            VALUES
            (@idPedido, @distanciaEntrega, @pesoEntrega, @acrescimoEntrega, @descontoEntrega, @taxaEntrega, @valor_finalEntrega, @statusEntrega)
            `;

            await transaction.request()
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .input("distanciaEntrega", sql.Decimal(10,2), distanciaEntrega)
            .input("pesoEntrega", sql.Decimal(10,2), pesoEntrega)
            .input("acrescimoEntrega", sql.Decimal(10,2), acrescimoEntrega)
            .input("descontoEntrega", sql.Decimal(10,2), descontoEntrega)
            .input("taxaEntrega", sql.Decimal(10,2), taxaEntrega)
            .input("valor_finalEntrega", sql.Money, valor_finalEntrega)
            .input("statusEntrega", sql.VarChar(15), statusEntrega)
            .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao inserir a entrega', error);
            throw error;
        }
     },


    // ---------------------
    // ATUALIZAR UMA ENTREGA
    // PUT /entregas
    /*
        {
		"statusEntrega": "em trânsito"
	}
    */
    // ---------------------

     atualizarEntrega: async (idEntrega, idPedido, distanciaEntrega, pesoEntrega, acrescimoEntrega, descontoEntrega, taxaEntrega, valor_finalEntrega, statusEntrega ) => {

        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE ENTREGA
                SET
                    idPedido = @idPedido,
                    distanciaEntrega = @distanciaEntrega,
                    pesoEntrega = @pesoEntrega,
                    acrescimoEntrega = @acrescimoEntrega,
                    descontoEntrega = @descontoEntrega,
                    taxaEntrega = @taxaEntrega,
                    valor_finalEntrega = @valor_finalEntrega,
                    statusEntrega = @statusEntrega
                WHERE idEntrega = @idEntrega
            `;

            await pool.request()
            .input("idEntrega", sql.UniqueIdentifier, idEntrega)
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .input("distanciaEntrega", sql.Decimal(10,2), distanciaEntrega)
            .input("pesoEntrega", sql.Decimal(10,2), pesoEntrega)
            .input("acrescimoEntrega", sql.Decimal(10,2), acrescimoEntrega)
            .input("descontoEntrega", sql.Decimal(10,2), descontoEntrega)
            .input("taxaEntrega", sql.Decimal(10,2), taxaEntrega)
            .input("valor_finalEntrega", sql.Money, valor_finalEntrega)
            .input("statusEntrega", sql.VarChar(15), statusEntrega)
            .query(querySQL);

        } catch (error) {
            console.error('Erro ao atualizar entrega', error);
            throw error;
        }
     },

    // ---------------------
    // DELETAR ENTREGA
    // DELETE /entregas
    /*
        colocar o ID no routes. 
    */
    // ---------------------

     deletarEntrega: async (idEntrega) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const querySQL = `
                DELETE FROM ENTREGA
                WHERE idEntrega = @idEntrega
            `;

            await transaction.request()
            .input("idEntrega", sql.UniqueIdentifier, idEntrega)
            .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error('Erro ao deletar entrega', error);
            throw error;
        }
     }
}

module.exports = { entregaModel }
