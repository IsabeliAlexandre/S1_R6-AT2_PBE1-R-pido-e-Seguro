const express = require("express");
const app = express();
require("dotenv").config();
const {clientesRoutes} = require("./src/routes/clientesRoutes");
const {pedidosRoutes} = require("./src/routes/pedidosRoutes");
const {entregasRoutes} = require("./src/routes/entregasRoutes")

const PORT = 8081;

app.use(express.json());
app.use('/', clientesRoutes);
app.use('/', pedidosRoutes);
app.use('/', entregasRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost${PORT}`);
}); 