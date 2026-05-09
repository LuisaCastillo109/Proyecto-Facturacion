import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/productos.css";
import { Link } from "react-router-dom";

const Productos = () => {
  const API = "http://localhost:3014";

  // ESTADOS INDIVIDUALES (Para mayor control)
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState("");
  const [estado, setEstado] = useState("activo");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    const res = await axios.get(`${API}/ObtenerProductos`);
    setProductos(res.data);
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const limpiarForm = () => {
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setStock("");
    setEstado("activo");
    setImagen(null);
    setPreview(null);
    setEditando(null);
  };

  /* =========================
      CREAR PRODUCTO
  ========================= */
  const crearProducto = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("precio", precio);
      formData.append("descripcion", descripcion);
      formData.append("estado", estado);
      formData.append("stock", stock);
      formData.append("imagen", imagen);

      await axios.post(`${API}/CrearProducto`, formData);
      alert("Producto creado con éxito");
      obtenerProductos();
      limpiarForm();
    } catch (error) {
      alert("Error al crear producto");
    }
  };

  const cargarEdicion = (p) => {
    setEditando(p.id);
    setNombre(p.nombre);
    setPrecio(p.precio);
    setDescripcion(p.descripcion);
    setStock(p.stock);
    setEstado(p.estado);
    setPreview(p.imagen ? `${API}/uploads/${p.imagen}` : null);
  };

  const ActualizarProductos = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("precio", precio);
      formData.append("descripcion", descripcion);
      formData.append("stock", stock);
      formData.append("estado", estado);
      
      if (imagen) {
        formData.append("imagen", imagen);
      }

      await axios.put(`${API}/ActualizarProducto/${editando}`, formData);
      
      alert("Producto actualizado con éxito");
      obtenerProductos();
      limpiarForm();
    } catch (err) {
      console.error(err);
      alert("Error en el servidor al actualizar");
    }
  };

  const eliminarProducto = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este producto?")) {
        await axios.delete(`${API}/EliminarProducto/${id}`);
        obtenerProductos();
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuario(user);
    }
  }, []);

  const subirFoto = async () => {
    if (!archivo) {
      alert("Seleccione una imagen");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("foto", archivo);
      const response = await axios.put(
        `http://localhost:3014/subirFoto/${usuario.id}`,
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

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
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
                        onClick={subirFoto}
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
    <div className="container">
      <div className="header">
        <h2 className="titulo">Gestión de Productos</h2>
        <div>
          <span className="badge">Total: {productos.length}</span>
          <input
            type="text"
            placeholder="Buscar producto..."
            className="search"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="form-box">
        <h3>{editando ? "Editar Producto" : "Nuevo Producto"}</h3>

        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <input type="file" onChange={handleImagen} />

        {preview && (
          <div className="preview">
            <img src={preview} alt="Vista previa" />
          </div>
        )}

        <div className="form-buttons">
            {editando ? (
            <>
                <button className="btn btn-crear" onClick={ActualizarProductos}>Actualizar</button>
                <button className="btn btn-cancelar" onClick={limpiarForm}>Cancelar</button>
            </>
            ) : (
            <button className="btn btn-crear" onClick={crearProducto}>Guardar Producto</button>
            )}
        </div>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>
                <img className="img-producto" src={p.imagen ? `${API}/uploads/${p.imagen}` : "https://via.placeholder.com/50"} alt="" />
              </td>
              <td><strong>{p.nombre}</strong></td>
              <td>${p.precio}</td>
              <td>{p.stock}</td>
              <td><span className={p.estado === "activo" ? "estado-activo" : "estado-inactivo"}>{p.estado}</span></td>
              <td>
                <button className="btn btn-editar" onClick={() => cargarEdicion(p)}>Editar</button>
                <button className="btn btn-eliminar" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Productos;