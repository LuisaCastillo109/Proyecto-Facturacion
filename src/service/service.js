const cors = require ("cors");
const express = require ("express");
const bodyParser = require ("body-parser");
const router = require ("../Routes/usuario.router");
const path = require ("path");
const factura = require("../Routes/factura.router");

const  dir = path.join(__dirname, "uploads");
const PORT = process.env.PORT || 3014;
const app = express();
app.use (cors());
app.use (bodyParser.json());
app.use ("/",router);
app.use ("/",factura)
app.use ("/uploads", express.static(dir))
app.use ("/pdf", express.static(path.join(__dirname , "pdf")))


app.listen (PORT,()=>{
console.log(`Servidor corriendo por el puerto ${PORT}`)
});