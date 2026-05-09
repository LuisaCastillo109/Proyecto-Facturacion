import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/principal.css";
import axios from "axios";

const PaginaPrincipal = () => {
  const [usuario, setUsuario] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuario(user);
    }
  }, []);

  const SubirFoto = async () => {
    if (!archivo) {
      alert("Seleccione una imagen");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("foto", archivo);
      const response = await axios.put(
        `http://localhost:3014/SubirFoto/${usuario.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        });
      const nombreFotoNueva = response.data.foto;
      const userActualizado = { ...usuario, foto: nombreFotoNueva };
      localStorage.setItem("usuario", JSON.stringify(userActualizado));

      setUsuario(userActualizado);

      alert("Foto actualizada con éxito");
      setMostrarMenu(false);
    } catch (error) {
      console.error(error);
      alert("Error al subir la foto");
    }};

  const CerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("Token");
    setUsuario(null);
    window.location.href = "/"; 
  };

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo12-img">
          <img src="../imagenes/logo.png" alt="logo" />
        </div>

        <ul>
          {!usuario ? (
            <>
              <li><Link to="/InicioSesion">Iniciar sesión</Link></li>
              <li><Link to="/registro" className="btn-nav">Crear cuenta</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/Dashboard">Dashboard</Link></li>
              <li><Link to="/factura">Facturación</Link></li>
            </>
          )}
        </ul>

        {usuario && (
          <div className="usuario-navbar" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' }}>
            <span style={{ fontWeight: 'bold' }}>{usuario.nombre}</span>
            <img
              className="foto-perfil"
              // Usamos una clave única (timestamp) para forzar a React a recargar la imagen del servidor
              src={
                usuario.foto
                  ? `http://localhost:3014/uploads/${usuario.foto}?t=${new Date().getTime()}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="perfil"
              style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
              onClick={() => setMostrarMenu(!mostrarMenu)}
            />

            {mostrarMenu && (
              <div className="menu-perfil" style={{ position: 'absolute', top: '50px', right: '0', background: 'white', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100, minWidth: '150px' }}>
                <p style={{ color: 'black', fontSize: '12px', margin: '0 0 10px 0' }}>Cambiar foto:</p>
                <input 
                  type="file" 
                  onChange={(e) => setArchivo(e.target.files[0])} 
                  style={{ fontSize: '10px', marginBottom: '10px', width: '100%' }}
                />
                <button 
                  onClick={SubirFoto}
                  style={{ width: '100%', padding: '5px', marginBottom: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Guardar Foto
                </button>
                <hr />
                <Link to="/perfil" style={{ display: 'block', margin: '10px 0', color: '#333', textDecoration: 'none' }}>Mi Perfil</Link>
                <button onClick={CerrarSesion} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'left' }}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero, Features y Footer se mantienen igual... */}
      <section className="hero">
        <div className="hero-text">
          <h2> SISTEMA DE <p>FACTURACION ELECTRONICA</p> </h2>
          <h1> Gestiona clientes, productos y facturas en un solo lugar. </h1>
          <div className="hero-buttons">
            <Link to={usuario ? "/Dashboard" : "/registro"} className="btn-principal">
              {usuario ? "Ir al Dashboard" : "Empezar gratis"}
            </Link>
          </div>
        </div>
        <div className="hero-img">
          <img src="../imagenes/imagen_logo.png" alt="dashboard" />
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Misamoo - Sistema de facturación</p>
      </footer>
    </div>
  );
};

export default PaginaPrincipal;