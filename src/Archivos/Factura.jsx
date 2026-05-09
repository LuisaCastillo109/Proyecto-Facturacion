import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/factura.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

 

const Factura = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]); // <--- NUEVO: Estado para el historial
  const [items, setItems] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [usuario, setUsuario] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [fechaTarjeta, setFechaTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [clienteEditado, setClienteEditado] = useState({
  documento: "",
  telefono: "",
  direccion: "",
  email: ""
});
const [facturaAbierta, setFacturaAbierta] = useState(null);
  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) setUsuario(user);
  }, []);

  const cargarDatos = () => {
    axios.get("http://localhost:3014/ObtenerClientes").then(res => setClientes(res.data));
    axios.get("http://localhost:3014/ObtenerProductos").then(res => setProductos(res.data));
    axios.get("http://localhost:3014/ObtenerFacturas").then(res => setFacturas(res.data)); // <--- CARGAR HISTORIAL
  };

  // FUNCIÓN PARA CAMBIAR ESTADO (La que "desbloquea" las ventas en el Dashboard)
  const pagarFactura = async (id) => {
    try {
      await axios.put(`http://localhost:3014/PagarFactura/${id}`);
      alert("Factura marcada como PAGADA");
      cargarDatos(); // Recargamos para ver el cambio
    } catch (error) {
      alert("Error al procesar pago");
    }
  };

 const seleccionarCliente = (id) => {
  setClienteId(id);
  const cliente = clientes.find(c => c.id === Number(id));
  setClienteSeleccionado(cliente);

  if (cliente) {
    setClienteEditado({
      documento: cliente.documento || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      email: cliente.email || ""
    });
  }
};
  const navigate = useNavigate();
   const subirFoto = async () => {
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

  const guardarFactura = async () => {
  // 🔴 VALIDAR USUARIO
  if (!usuario || !usuario.id) {
    alert("Usuario no disponible, inicia sesión nuevamente");
    return;
  }

  // 🔴 VALIDAR DATOS
  if (!clienteId || items.length === 0 || !metodoPago) {
    alert("Complete los datos");
    return;
  }

  try {
    // 🔥 DEBUG REAL
    console.log("ENVIANDO:", {
      usuario_id: usuario.id,
      id_cliente: clienteId,
      metodo_pago: metodoPago,
      subtotal,
      iva,
      total,
      items
    });

    const res = await axios.post("http://localhost:3014/crearFactura", {
      usuario_id: usuario.id,
      id_cliente: clienteId,
      metodo_pago: metodoPago,
      subtotal,
      iva,
      total,
      items
    });

    const cliente = clientes.find(c => c.id === Number(clienteId));

    const facturaCompleta = {
      id: res.data.id,
      nombre: cliente?.nombre || "",
      apellido: cliente?.apellido || "",
      telefono: cliente?.telefono || "",
      documento: cliente?.documento || "",
      fecha: new Date(),
      metodo_pago: metodoPago,
      items,
      subtotal,
      iva,
      total
    };

    navigate("/comprobante", {
      state: { factura: facturaCompleta }
    });

  } catch (error) {
    console.error("ERROR REAL:", error.response?.data || error.message);
    alert("Error al crear factura");
  }
};

  const CerrarSesion =()=>{
  localStorage.removeItem("usuario");
  localStorage.removeItem("Token")
  window.location.href ="/"
  }

  // Cálculos automáticos
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const agregarProducto = () => {
    const producto = productos.find(p => p.id === Number(productoId));
    if (producto) {
      setItems([...items, { producto_id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad }]);
    }
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

      <div className="main-content">

        {/* 🔥 GRID PRINCIPAL */}
        <div className="grid-layout">

          {/* IZQUIERDA */}
          <div className="left-panel">
            <div className="card form-section">

              <h3>Datos del Cliente</h3>

              <select value={clienteId} onChange={(e) => seleccionarCliente(e.target.value)}>
                <option value="">Seleccione cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>

              {clienteSeleccionado && (
                <div className="cliente-mini">

                  <div className="campo">
                    <label>Documento</label>
                    <input
                      className="input-mini"
                      value={clienteEditado.documento}
                      onChange={(e) =>
                        setClienteEditado({ ...clienteEditado, documento: e.target.value })
                      }
                    />
                  </div>

                  <div className="campo">
                    <label>Teléfono</label>
                    <input
                      className="input-mini"
                      value={clienteEditado.telefono}
                      onChange={(e) =>
                        setClienteEditado({ ...clienteEditado, telefono: e.target.value })
                      }
                    />
                  </div>

                  <div className="campo">
                    <label>Dirección</label>
                    <input
                      className="input-mini"
                      value={clienteEditado.direccion}
                      onChange={(e) =>
                        setClienteEditado({ ...clienteEditado, direccion: e.target.value })
                      }
                    />
                  </div>

                  <div className="campo">
                    <label>Email</label>
                    <input
                      className="input-mini"
                      value={clienteEditado.email}
                      onChange={(e) =>
                        setClienteEditado({ ...clienteEditado, email: e.target.value })
                      }
                    />
                  </div>

                </div>
              )}

              <div className="form-group">
                <h3>Método de Pago</h3>
                <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <option value="">Seleccione...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Nequi">Nequi</option>
                </select>
              </div>


              <hr />

              <div className="form-row">
                <div className="form-group">
                  <label>Producto</label>
                  <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (${p.precio})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group qty">
                  <label>Cant.</label>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                  />
                </div>
              </div>

              <button className="btn-add" onClick={agregarProducto}>
                Agregar a la Lista
              </button>

            </div>
          </div>

          
        
            <div className="card preview-section">

           {/* PREVISUALIZACIÓN */}
        <div className="card preview-section">
            
            <h3><i className="fas fa-file-invoice"></i> Detalle de Factura</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.nombre}</td>
                    <td>{i.cantidad}</td>
                    <td className="text-right">${(i.precio * i.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="totals-section">
            <div className="total-row"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
            <div className="total-row"><span>IVA (19%):</span> <span>${iva.toFixed(2)}</span></div>
            <div className="total-row grand-total"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
          </div>
          <button className="btn-generate" onClick={guardarFactura}>Emitir Comprobante</button>
        </div>
      </div>

      {/* HISTORIAL */}
      <div className="card history-section">
        <div className="card-header">
          <h3>Historial Reciente</h3>
        </div>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
  {facturas.map(f => (
    <React.Fragment key={f.id}>
      
      {/* FILA PRINCIPAL */}
      <tr onClick={() =>(f.id)} style={{ cursor: "pointer" }}>
        <td>▶ {f.id}</td>
        <td><strong>{f.nombre} {f.apellido}</strong></td>
        <td>{new Date(f.fecha).toLocaleDateString()}</td>
        <td>${f.total.toFixed(2)}</td>
        <td>
          <span className={`badge ${f.estado.toLowerCase()}`}>
            {f.estado}
          </span>
        </td>
        <td>
          {f.estado === 'PENDIENTE' && (
            <button 
              className="btn-pay"
              onClick={(e) => {
                e.stopPropagation(); // 🔥 evita que se abra al pagar
                pagarFactura(f.id);
              }}
            >
              Pagar
            </button>
          )}
        </td>
      </tr>

      {/* FILA DESPLEGABLE */}
      {facturaAbierta === f.id && (
        <tr className="expand-row">
          <td colSpan="6">
            <div className="expanded-content">
              <p><strong>ID:</strong> {f.id}</p>
              <p><strong>Cliente:</strong> {f.nombre} {f.apellido}</p>
              <p><strong>Fecha:</strong> {new Date(f.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${f.total}</p>
              <p><strong>Método de pago:</strong> {f.metodo_pago}</p>
              <p><strong>Estado:</strong> {f.estado}</p>

              {/* Aquí puedes agregar productos si luego los traes */}
            </div>
          </td>
        </tr>
      )}

    </React.Fragment>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

)};
export default Factura;