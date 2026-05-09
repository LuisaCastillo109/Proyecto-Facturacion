import {useNavigate} from "react-router-dom";
import React,{useState} from "react";
import axios from "axios";
import "../css/ejemplo.css";
import { FaFacebook, FaEnvelope } from "react-icons/fa";

const RecuperarContraseña =()=>{
const [correo,setCorreo]=useState("");

const navigate = useNavigate();

const RecuperarPassword =async(e)=>{
e.preventDefault();
try{
const response = await axios.post("http://localhost:3014/RecuperarPassword",
{correo}
)
alert(response.data)
}catch(err){
if (err.reponse){
alert (err.response.data)
}else{
console.log("Error en el servidor")
}}};

return (
<div class="ejemplo">
 <div className="logo-container">
  <img 
    src="../imagenes/logo.png" 
    alt="FacturaPro" 
    className="logo-img"
  />
<div className="contenedor-registro">

  <div className="card-registro">
   
<form onSubmit={RecuperarPassword}>
<h1 className="titulo-registro"><center>RECUPERAR CONTRASEÑA</center></h1>

<input
type="email"
placeholder="Correo Electronico"
value={correo}
onChange={(e)=>setCorreo(e.target.value)}
required
/>

<button type="submit"className="boton-cuenta">Enviar</button>
</form>
<div className="redes">
      <p>Contáctanos</p>

      <div className="iconos">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          <FaFacebook className="icon facebook" />
          Facebook
        </a>

        <a href="mailto:dkim44243@gmail.com">
          <FaEnvelope className="icon correo" />
          dkim44243@gmail.com
        </a>
      </div>
    </div>
    </div>
</div>
</div>
</div>
)}
export default RecuperarContraseña;
