const cors = require ("cors");
const express = require ("express");
const bodyParser = require ("body-parser");
const UsuariosControllers = require ("../Controllers/usuario.controller");
const {VerificarToken,TokenRol} = require("../service/jwt")
const router = express.Router();
const multer = require ("multer");
const path = require ("path")

const imagenes = multer.diskStorage({

destination : (req,res,cb)=>{
cb (null, path.join (__dirname, "..", "service", "uploads"))
},
filename : (req,file,cb)=>{
cb (null, Date.now()+path.extname(file.originalname))
}});

const imagen = multer({storage : imagenes})


const PDF = multer.diskStorage({
destination : (req,file,cb)=>{
cb (null, path.join(__dirname, "..", "service", "pdf"))
},
filename : (req,file,cb)=>{
cb (null, Date.now()+path.extname(file.originalname))
}});

const SubirPDF = multer({storage : PDF,
fileFilter : (req,file,cb)=>{
if (file.mimetype ==="application/pdf"){
cb (null,true)
}
else{
cb (new Error ("Solo se permiten pdf"), false)
}}});


router.post("/crear",UsuariosControllers.CrearUsuario);
router.post("/CrearCliente",UsuariosControllers.CrearClientes);
router.get("/consultar/:id",VerificarToken,TokenRol([1]),UsuariosControllers.ConsultarUsuarios);
router.get("/ObtenerUsuarios",UsuariosControllers.ObtenerUsuarios);
router.get("/ObtenerClientes",UsuariosControllers.ObtenerClientes);
router.put("/actualizar/:id",UsuariosControllers.ActualizarUsuarios);
router.put("/CambiarEstado/:id",UsuariosControllers.CambiarEstado);
router.put("/SubirFoto/:id",imagen.single("foto"),UsuariosControllers.SubirFoto);
router.put("/SubirPDF/:id",SubirPDF.single("pdf"),UsuariosControllers.SubirPDF);
router.put("/ActualizarPerfil/:id",UsuariosControllers.ActualizarPerfil);
router.delete("/eliminar/:id",VerificarToken,TokenRol([1]),UsuariosControllers.EliminarUsuarios);
router.delete("/EliminarCliente/:id",UsuariosControllers.EliminarClientes);
router.post("/login",UsuariosControllers.LoginUsuario);
router.post("/RecuperarPassword",UsuariosControllers.RecuperarPassword);
router.post("/ReestablecerPassword",UsuariosControllers.ReestablecerPassword);

module.exports = router;
