import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/crud.css";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSearch, FaTrash, FaIdCard } from "react-icons/fa";
import { FaMale, FaFemale } from "react-icons/fa";

const GestionClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  
  // Estado para el formulario de nuevo cliente
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    tipo_documento: "",
    documento: "",
    direccion: "",
    email: "",
    genero :"",
    telefono : ""
  });

  const API = "http://localhost:3014";
  const Token = localStorage.getItem("Token");

  const api = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${Token}`
    }
  });

  // --- LÓGICA DE API ---

  const obtenerClientes = async () => {
    try {
      // Cambiado de /ObtenerUsuarios a /ObtenerClientes
      const response = await api.get("/ObtenerClientes");
      setClientes(response.data);
    } catch (err) {
      console.error("Error al obtener los clientes", err);
    }
  };

  const crearCliente = async (e) => {
    e.preventDefault();
    try {
      await api.post("/CrearCliente", nuevoCliente);
      alert("Cliente creado con éxito");
      setNuevoCliente({ nombre: "", apellido: "", documento: "", direccion: "", email: "", genero:"", telefono :"" }); // Limpiar form
      obtenerClientes(); // Recargar lista
    } catch (err) {
      alert("Error al crear el cliente");
    }
  };

  const EliminarClientes = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await api.delete(`/EliminarCliente/${id}`);
        obtenerClientes();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("Token");
    window.location.href = "/";
  };

  // --- EFECTOS ---

  useEffect(() => {
    obtenerClientes();
    const user = localStorage.getItem("usuario");
    if (user) setUsuarioAdmin(JSON.parse(user));
    document.body.classList.add("body-twice");
    return () => document.body.classList.remove("body-twice");
  }, []);

  // --- FILTRO ---

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.documento?.includes(busqueda) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="landing">
      {/* NAVBAR (Mantenida de tu código original) */}
      <nav className="navbar">
        <div className="logo12-img">
          <img src="../imagenes/logo.png" alt="logo" />
        </div>
        <ul>
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/factura">Facturación</Link></li>
        </ul>
        {usuarioAdmin && (
          <div className="usuario-navbar" onClick={() => setMostrarMenu(!mostrarMenu)}>
            <span style={{ fontWeight: 'bold' }}>{usuarioAdmin.nombre}</span>
            <img 
              src={usuarioAdmin.foto ? `${API}/uploads/${usuarioAdmin.foto}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="perfil" className="foto-perfil" 
            />
            {mostrarMenu && (
              <div className="menu-perfil">
                <button onClick={cerrarSesion} className="btn-logout">Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="admin-layout">
        <div className="main-content">
          
          <div className="topbar">
            <h2>Gestión de Clientes</h2>
            <div className="topbar-right">
              <div className="contador">Total: <strong>{clientes.length}</strong></div>
              <div className="buscador">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* FORMULARIO DE CREACIÓN */}
          <div className="card form-crear">
            <h3><FaUserPlus /> Registrar Nuevo Cliente</h3>
            <form onSubmit={crearCliente} className="grid-form">
              <input 
                type="text" placeholder="Nombre" required
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
              />
              <input 
                type="text" placeholder="Apellido" required
                value={nuevoCliente.apellido}
                onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})}
              />
              <select
  required
  value={nuevoCliente.tipo_documento}
  onChange={(e) =>
    setNuevoCliente({
      ...nuevoCliente,
      tipo_documento: e.target.value
    })
  }
>
  <option value="">Tipo documento</option>
  <option value="CC">CC Colombiana</option>
  <option value="CE">CE Extranjería</option>
  <option value="PP">Pasaporte</option>
</select>
              <input
  type="text"
  placeholder="Número documento"
  required
  value={nuevoCliente.documento}
  onChange={(e) =>
    setNuevoCliente({
      ...nuevoCliente,
      documento: e.target.value
    })
  }
/>
              <input 
                type="email" placeholder="Email" required
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
              />
              <input 
                type="text" placeholder="Dirección" required
                value={nuevoCliente.direccion}
                onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
              />

               <input 
                type="text" placeholder="Telefono" required
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
              />

             <select
  required
  value={nuevoCliente.genero}
  onChange={(e) => setNuevoCliente({
    ...nuevoCliente,
    genero: e.target.value
  })}
>
  <option value="">Seleccione género</option>
  <option value="masculino">Masculino</option>
  <option value="femenino">Femenino</option>
</select>

              <button type="submit" className="btn-save">Guardar Cliente</button>
            </form>
          </div>

          {/* TABLA DE CLIENTES */}
          <div className="card">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Doc.</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Telefono</th>
                  <th>Genero</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((c) => (
                    <tr key={c.id}>
                      <td>
  <FaIdCard />

  {c.tipo_documento === "CC" && (
    <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
      CC:
    </span>
  )}

  {c.tipo_documento === "CE" && (
    <span style={{ color: "#ef6c00", fontWeight: "bold" }}>
      CE:
    </span>
  )}

  {c.tipo_documento === "PP" && (
    <span style={{ color: "#1565c0", fontWeight: "bold" }}>
      PP:
    </span>
  )}

  {" "}{c.documento}
</td>
   <td>
  <div className="nombre-user">
    <div className={`avatar-letra ${c.genero}`}>
      {c.nombre.charAt(0)}{c.apellido.charAt(0)}
    </div>
    <span>{c.nombre} {c.apellido}</span>
  </div>
</td>
                      <td>{c.email}</td>
                      <td>{c.direccion}</td>
                      <td>{c.telefono}</td>
                      <td style={{ display: "flex", alignItems: "center", gap: "3px" }}>
  {c.genero === "femenino" ? (
    <>
      <FaFemale color="#e84393" />
      Femenino
    </>
  ) : (
    <>
      <FaMale color="#0984e3" />
      Masculino
    </>
  )}
</td>
                      <td>
                        <button className="btn-delete" onClick={() => EliminarClientes(c.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center">No se encontraron clientes</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GestionClientesAdmin;