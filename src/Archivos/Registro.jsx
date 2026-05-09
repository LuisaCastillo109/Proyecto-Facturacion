import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../css/ejemplo.css";
import { FaFacebook, FaEnvelope } from "react-icons/fa";

const Registro =()=>{
const [nombre,setNombre]=useState("");
const [apellido,setApellido]=useState("");
const [correo,setCorreo]=useState("");
const [contraseña,setContraseña]=useState("");

const navigate = useNavigate();

const LoginUsuario =()=>{
navigate("/InicioSesion")
}

const CrearUsuario =async(e)=>{
e.preventDefault();
try{
const response = await axios.post("http://localhost:3014/crear",
{nombre,apellido,correo,contraseña}
)
alert("Usuario registrado con exito")
navigate("/InicioSesion")
}catch(err){
if (err.response){
alert (err.response.data)
}else{
alert("Error en el servidor")
}}};


return (
   <div className="logo-container">
  <img 
    src="../imagenes/logo.png" 
    alt="FacturaPro" 
    className="logo-img"
  />
<div className="contenedor-registro">
 

  <div className="card-registro">
    
    <form onSubmit={CrearUsuario}>
      <h1 className="titulo-registro">REGISTRO</h1>

      <input
        type="text"
        placeholder="Nombre"
        value ={nombre}
        onChange={(e)=>setNombre(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Apellido"
        value ={apellido}
        onChange={(e)=>setApellido(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Correo Electrónico"
        value ={correo}
        onChange={(e)=>setCorreo(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value ={contraseña}
        onChange={(e)=>setContraseña(e.target.value)}
        required
      />

      <button type="submit" className="boton-cuenta">
        Crear Usuario
      </button>

      <button type="button" className="link" onClick={LoginUsuario}>
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </form>

    {/* 🔥 REDES / CONTACTO */}
    <div className="redes">
      <p>Contáctanos</p>

      <div className="iconos">
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

export default Registro;