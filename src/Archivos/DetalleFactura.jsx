import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/detalle.css";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const FacturasUsuarios = () => {
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargarDatos = (usuarioId) => {
      axios.get(`http://localhost:3014/ObtenerClientes/${usuarioId}`).then(res => setClientes(res.data));
      axios.get(`http://localhost:3014/ObtenerFacturas/${usuarioId}`).then(res => setFacturas(res.data)); // <--- CARGAR HISTORIAL
    };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) setUsuario(user);
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("usuario"));
      const res = await axios.get("http://localhost:3014/ObtenerClientesConFacturas");
      const agrupados = agruparUsuarios(res.data);
      setUsuarios(agrupados);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const Factura =()=>{
  navigate ("/factura")
  }

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
  

  const agruparUsuarios = (data) => {

  const usuariosMap = {};

  data.forEach((item) => {

    if (!usuariosMap[item.id_cliente]) {

      usuariosMap[item.id_cliente] = {
        ...item,
        facturas: [],
      };

    }

    const existeFactura =
      usuariosMap[item.id_cliente].facturas.some(
        factura => factura.id === item.factura_id
      );

    if (!existeFactura) {

      usuariosMap[item.id_cliente].facturas.push({
        id: item.factura_id,
        total: item.total,
        estado: item.estado,
        fecha: item.fecha,
        metodo_pago: item.metodo_pago,
        pdf: item.pdf
      });

    }

  });

  return Object.values(usuariosMap);
};

  const subirPDF = async (e, id) => {
  const file = e.target.files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    await axios.put(
      `http://localhost:3014/SubirPDF/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert("PDF subido correctamente");
    obtenerDatos();

  } catch (error) {
    console.log(error);
    alert("Error al subir PDF");
  }
};


const exportarExcel = () => {

  const datos = [];

  usuarios.forEach(user => {

    user.facturas.forEach(factura => {

      datos.push({
        "ID Factura": factura.id,
        "Cliente": `${user.nombre} ${user.apellido}`,
        "Total": factura.total,
        "Estado": factura.estado,
        "Método Pago": factura.metodo_pago,
        "Fecha": new Date(factura.fecha).toLocaleDateString()
      });

    });

  });

  const worksheet = XLSX.utils.json_to_sheet(datos);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Facturas"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    }
  );

  saveAs(data, "facturas.xlsx");
};


const usuariosFiltrados = usuarios.filter(user => {

  // Buscar por documento o nombre
  const coincideBusqueda =
    user.documento?.toString().includes(busqueda) ||
    `${user.nombre} ${user.apellido}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());

  // Tipo documento
  const coincideTipo =
    tipoDocumento === "Todos" ||
    user.tipo_documento === tipoDocumento;

  // Estado factura
  const coincideEstado =
    estadoFiltro === "Todos" ||
    user.facturas.some(
      factura => factura.estado === estadoFiltro
    );

  return coincideBusqueda && coincideTipo && coincideEstado;
});

  return (
    <div className="dashboard-container">
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
      <div className="content-layout">
        {/* Barra Lateral de Filtros (Igual a tu imagen) */}
        <aside className="sidebar-filters">

  <button
    className="btn-nueva-factura"
    onClick={Factura}
  >
    + Nueva factura
  </button>

  <div className="filter-group">
    <label>Buscar por documento o nombre</label>

    <input
      type="text"
      placeholder="CC, CE, Pasaporte..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
  </div>

  <div className="filter-group">
    <label>Tipo de documento</label>

    <select
      value={tipoDocumento}
      onChange={(e) => setTipoDocumento(e.target.value)}
    >
      <option value="Todos">Todos</option>
      <option value="CC">CC</option>
      <option value="CE">CE</option>
      <option value="Pasaporte">Pasaporte</option>
    </select>
  </div>

  <div className="filter-group">
    <label>Estado</label>

    <select
      value={estadoFiltro}
      onChange={(e) => setEstadoFiltro(e.target.value)}
    >
      <option value="Todos">Todos</option>
      <option value="PENDIENTE">Pendiente</option>
      <option value="PAGADA">Pagada</option>
    </select>
  </div>

</aside>
        {/* Tabla de Resultados */}
        <main className="table-section">
          <div className="table-header">
            <h2>Ingresos / Todos los documentos</h2>
            <div className="table-actions">
             <button onClick={exportarExcel}>
  Exportar / Impresiones
</button>
            </div>
          </div>

          <div className="card-table">
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Total</th>
                  <th>Cliente</th>
                  <th>Fecha de Emisión</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.flatMap(user => 
                  user.facturas.map(factura => (
                    <tr key={factura.id}>
  <td>{factura.id}</td>

  <td className="text-bold">${factura.total}</td>

  {/* CLIENTE + PDF */}
  <td>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
  style={{
    display: "flex",
    flexDirection: "column"
  }}
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "bold"
    }}
  >
    <User size={16} />
    {user.nombre} {user.apellido}
  </span>

  <div
  style={{
    marginLeft: "22px",
    marginTop: "3px",
    display: "flex",
    flexDirection: "column",
    fontSize: "12px",
    color: "#666"
  }}
>
  <span>
    <strong>Tipo:</strong>{" "}
    
    {user.tipo_documento === "CC" && "Cédula Colombiana"}

    {user.tipo_documento === "CE" && "Cédula Extranjería"}

    {user.tipo_documento === "PP" && "Pasaporte"}
  </span>

  <span>
    <strong>Número:</strong> {user.documento}
  </span>
</div>
</div>

      {/* VER PDF AL LADO */}
      {factura.pdf && (
        <a
          href={`http://localhost:3014/pdf/${factura.pdf}`}
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#007bff",
            color: "white",
            padding: "3px 8px",
            borderRadius: "5px",
            fontSize: "12px",
            textDecoration: "none"
          }}
        >
          PDF
        </a>
      )}
    </div>
  </td>

  <td>{new Date(factura.fecha).toLocaleDateString()}</td>

  <td>
    <span className={`status-badge ${factura.estado?.toLowerCase()}`}>
      {factura.estado || "Expedida"}
    </span>
  </td>

  {/* ACCIONES */}
  <td>
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => subirPDF(e, factura.id)}
    />
  </td>
</tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal de Detalle */}
      {facturaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-invoice">
            <button className="close-modal" onClick={() => setFacturaSeleccionada(null)}>×</button>
            <h2>Detalle de Factura #{facturaSeleccionada}</h2>
            {detalle.length > 0 && (
              <div className="invoice-details">
                <div className="invoice-header-info">
                  <p><strong>Cliente:</strong> {detalle[0].nombre} {detalle[0].apellido}</p>
<p><strong>Email:</strong> {detalle[0].email}</p>
<p><strong>Documento:</strong> {detalle[0].documento}</p>
<p><strong>Teléfono:</strong> {detalle[0].telefono}</p>
<p><strong>Dirección:</strong> {detalle[0].direccion}</p>
                </div>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.map((item, i) => (
                      <tr key={i}>
                        <td>{item.producto}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precio_unitario}</td>
                        <td>${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="invoice-total">
                  <h3>Total: ${detalle[0].total}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturasUsuarios;