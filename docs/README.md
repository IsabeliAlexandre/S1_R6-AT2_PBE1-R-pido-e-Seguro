## API Reference 

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

### Clientes 

#### GET /clientes 
**Descrição**: Obtém uma lista de clientes cadastrados 
**Response**: 

#### POST /clientes
**Descrição**: Cria um novo cliente
**Body**: 
 {
            "nomeCliente": "nome",
            "cpfCliente": "00000000000",
            "telefoneCliente": "12123451234",
            "emailCliente": "marianinhada.silva@email.com"
            "enderecoCliente": "Logradouro, Número, Bairro, Cidade, Estado, CEP"
        }
**Response**: 

    "message": "Cliente cadastrado com sucesso!"