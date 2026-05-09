import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../css/ejemplo.css";
import { FaFacebook, FaEnvelope } from "react-icons/fa";
const InicioSesion =()=>{

const [correo,setCorreo]=useState("");
const [contraseña,setContraseña]=useState("");

const navigate = useNavigate();

const RecuperarPassword =()=>{
navigate ("/RecuperarPassword")
}

const LoginUsuario =async(e)=>{
e.preventDefault();
try{
const response = await axios.post("http://localhost:3014/login",
{correo,contraseña}
);

alert ("Ingreso Exitoso");

localStorage.setItem("usuario",JSON.stringify(response.data.usuario));
localStorage.setItem("Token",(response.data.Token));

if (response.data.usuario.rol ===1){
navigate("/crud")
}else{
navigate("/factura")
}

}catch(err){
if (err.response?.data){
alert (err.response.data)
}else{
alert("Servidor caído")
}}};


return (
<div className="logo-container1">
  <img 
    src="../imagenes/logo.png" 
    alt="FacturaPro" 
    className="logo-img"
  />
<div className="contenedor-registro">

  <div className="card-registro">

    <form onSubmit={LoginUsuario}>
      <h1 className="titulo-registro">INICIO DE SESION</h1>

      <input 
        type="email"
        placeholder="Correo Electrónico"
        value={correo}
        onChange={(e)=>setCorreo(e.target.value)}
        required
      />

      <input 
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e)=>setContraseña(e.target.value)}
        required
      />

      <button type="submit" className="boton-cuenta">
        Ingresar
      </button>

      <button 
        type="button" 
        onClick={RecuperarPassword} 
        className="link"
      >
        ¿Olvidaste tu contraseña?
      </button>

    </form>

    {/* 🔥 MISMA SECCIÓN DE CONTACTO */}
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
)}

export default InicioSesion;