import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../css/ejemplo.css";
import { FaFacebook, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const ReestablecerContraseña = () => {
  const navigate = useNavigate();
  const { Token } = useParams();

  const [contraseña, setContraseña] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);

  const ReestablecerPassword = async (e) => {
    e.preventDefault();

    // 🔐 Validación
    if (contraseña !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3014/ReestablecerPassword",
        {
          Token: Token,
          contraseña,
        }
      );

      setMensaje(response.data);

      if (response.status === 200) {
        alert("Contraseña cambiada con éxito");
        navigate("/InicioSesion");
      }
    } catch (err) {
      if (err.response.data) {
        alert(err.response.data);
      } else {
        setMensaje("Error en el servidor");
      }
    }
  };

  return (
    <div className="ejemplo">
      <div className="logo-container">
        <img
          src="../imagenes/logo.png"
          alt="FacturaPro"
          className="logo-img"
        />

        <div className="contenedor-registro">
          <div className="card-registro">
            <form onSubmit={ReestablecerPassword}>
              <h1 className="titulo-registro">
                <center>NUEVA CONTRASEÑA</center>
              </h1>

              {/* PASSWORD */}
              <div className="input-password">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Nueva Contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />

                <span onClick={() => setMostrarPassword(!mostrarPassword)}>
                  {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* CONFIRMAR PASSWORD */}
              <div className="input-password">
                <input
                  type={mostrarConfirm ? "text" : "password"}
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <span onClick={() => setMostrarConfirm(!mostrarConfirm)}>
                  {mostrarConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="boton-cuenta">
                Cambiar Contraseña
              </button>

              <p>{mensaje}</p>
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
  );
};

export default ReestablecerContraseña;