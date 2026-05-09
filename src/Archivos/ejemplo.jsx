import React,{useState,Effect} from "react";
import{ useNavigate } from "react-router-dom";
import axios from "axios"

const Inicio =()=>{
const navigate = useNavigate();

const [correo,setCorreo]=useState("");
const [contraseña,setContraseña]=useState("");

const RecuperarPassword =()=>{
navigate ("/RecuperarPassword")
}

const InicioSesion =(e)=>{
e.preventDefault();
try{
const response = await axios.post("http://localhost:3014/login",
)
alert("Ingreso Exitoso");
localStorage.setItem("usuario",JSON.stringify(response.data.usuario));
localStorage.setItem("Token",response.data.Token)
if (response.data.usuario.rol ===1){
navigate ("/Crud")
}else{
navigate ("/Factura")
}}
catch(err){
if (err.respose.data){
alert (err.respose.data)
}else{
console.log("Error al ingresar")
}}};

return (
<div className="ejemplo">
<form onSubmit={InicioSesion}>
<input
type ="email"
placeholder="Correo Electronico"
value ={correo}
onChange={(e)=>setCorreo(e.target.value)}
required 
/>

<input
type ="password"
placeholder="Contraseña"
value ={contraseña}
onChange={(e)=>setContraseña(e.target.value)}
required 
/>


<button type ="submit">Ingresar</button>
<button type ="button" onClick={RecuperarPassword}>Olvidate tu contraseña? Ingrese aqui</button>
</form>
</div>
)}


export default Inicio;