## API Reference 


### Clientes 

#### GET /clientes 
- **Descrição**: Obtém uma lista de clientes cadastrados 
- **Response**: Mostra uma lista de todos os clientes que estão cadastrados

#### POST /clientes
**Descrição**: Cria um novo cliente
**Body**: 
```
 {
            "nomeCliente": "nome",
            "cpfCliente": "00000000000",
            "telefoneCliente": "12123451234",
            "emailCliente": "marianinhada.silva@email.com"
            "enderecoCliente": "Logradouro, Número, Bairro, Cidade, Estado, CEP"
        }
```
**Response**: 

    "message": "Cliente cadastrado com sucesso!"

#### Filtrar clientes 
- **Descrição**: Consegue filtrar um cliente por vez de acordo com o id:
#### GET /id do cliente

#### PUT /idCliente 
**Descrição**: Atualiza os dados dos clientes cadastrados.
**Body**: 
        {
            "nomeCliente": "nome" <- vai atualizar o que você quiser de acorod com o nome que você quiser.
        }
**Response**: 
    "message": "Cliente atualizado com sucesso!"

#### DELETE /idCliente 
**Descrição**: Deleta tudo do cliente cadastrado. 
**Response**: 
    "message": "Cliente deletado com sucesso!"

### Pedidos 

#### GET /pedidos 
**Descrição**: Obtém uma lista de pedidos 
**Response**: Array de pedidos

#### POST /pedidos
**Descrição**: Cria um novo pedido
**Body**: 
 {
    "idPedido": <- vai aparecer quando o pedido for postado,
     "idCliente": "id do cliente",
     "dataPedido": "0000-00-00",
      "tipoentregaPedido": "urgente ou normal",
      "distanciaPedido":
      "pesoPedido":
     "valor_KmPedido": 1,00 
     "valor_KgPedido": 1,50
 }
**Response**: 
    "message": "Pedido cadastrado com sucesso!"

#### PUT /idPedido 
**Descrição**: Atualiza dados do pedido como por exemplo ostatus de pagamento.
**Response**: 
    "message": "Pedido atualizado com sucesso!"

**Body**: 
        {
            "tipo_EntregaPedido": "urgente". <- Muda por exemplo o estado em que o pedido do cliente se encontra.
        }

#### DELETE /idPedido 
**Descrição**: Deleta o pedido do cliente.
**Response**: 
    "message": "Pedido deletado com sucesso!"


### Entrega

#### GET /entregas
**Descrição**: Obtém uma lista de todas as entregas cadastradas.
**Response**:

#### POST /entregas
**Descrição**: Cria uma nova entrega
**Body**:
 [
	{
		"idEntrega": "A1D09F97-24AC-42FE-AD60-DDD8BE4BD485",
		"idPedido": "3312F93B-1BE4-407C-AC7D-0935DA964B2A",
		"distanciaEntrega": 10,
		"pesoEntrega": 1,
		"acrescimoEntrega": 0,
		"descontoEntrega": 0,
		"taxaEntrega": 0,
		"valor_finalEntrega": 11,
		"statusEntrega": "Entregue"
	}
]
**Response**:

    "message": "Entrega cadastrado com sucesso!"

#### PUT /idEntrega
**Descrição**: Atualiza os dados das entregas cadastrados.
**Body**:
       {
		"statusEntrega": "Cancelado" <- atualizar por exemplo os status da entrega.
	    }
**Response**:
    "message": "Entrega atualizada com sucesso!"

#### DELETE /idEntrega
**Descrição**: Deleta tudo da entrega cadastrado.
**Response**:
    "message": "Entrega deletada com sucesso!"
