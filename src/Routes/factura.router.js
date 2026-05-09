const cors = require ("cors");
const express = require ("express");
const bodyParser = require ("body-parser");
const FacturaController = require("../Controllers/factura.controller")
const factura = express.Router();
const multer = require("multer");
const path = require("path");

const app = express();
app.use (cors());
app.use (bodyParser.json());

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "service", "uploads")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storageConfig });


factura.post("/crearFactura",FacturaController.CrearFactura);
factura.post("/CrearProducto", upload.single("imagen"),FacturaController.CrearProducto);
factura.get("/ObtenerFacturas",FacturaController.ObtenerFacturas);
factura.get("/ConsultarFactura/:id",FacturaController.ConsultarFactura);
factura.get("/ObtenerClientesConFacturas",FacturaController.ObtenerClientesConFacturas);
factura.get("/ObtenerFacturaCompleta/:id",FacturaController.ObtenerFacturaCompleta);
factura.get("/VentasMensuales",FacturaController.VentasMensuales);
factura.get("/DetalleFactura",FacturaController.DetalleFactura);
factura.get("/VentasPorProducto",FacturaController.VentasPorProducto);
factura.put("/PagarFactura/:id",FacturaController.PagarFactura);
factura.put("/ActualizarProducto/:id", upload.single("imagen"), FacturaController.ActualizarProducto);
factura.put("/subirFotoProducto",FacturaController.subirFotoProducto);
factura.delete("/EliminarFactura/:id",FacturaController.EliminarFactura);
factura.delete("/EliminarProducto/:id",FacturaController.EliminarProducto);
factura.get("/ObtenerProductos",FacturaController.ObtenerProductos);
factura.get("/ObtenerDashboard",FacturaController.ObtenerDashboard);

module.exports = factura;




