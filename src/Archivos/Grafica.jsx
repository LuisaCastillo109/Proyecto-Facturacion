import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { TrendingUp, Package, FileText, DollarSign } from "lucide-react";
import Menu from "../componentes/menu"; 
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import "../css/grafica.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DashboardGraficas = () => {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });

  const [archivo, setArchivo] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasProductos, setVentasProductos] = useState([]);
  const [datosResumen, setDatosResumen] = useState("");
 const [datos, setDatos] = useState({
    facturas: 0,
    ventas: 0
  });
 useEffect(() => {

  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!user) return;

  axios.get(`http://localhost:3014/VentasMensuales/${user.id}`)
    .then(res => setVentasMensuales(res.data))
    .catch(err => console.error(err));

  axios.get(`http://localhost:3014/VentasPorProducto/${user.id}`)
    .then(res => setVentasProductos(res.data))
    .catch(err => console.error(err));

  axios.get(`http://localhost:3014/Resumen/${user.id}`)
    .then(res => setDatosResumen(res.data))
    .catch(err => console.error(err));

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

  const modernPalette = ["#38bdf8", "#a855f7", "#fb923c", "#4ade80", "#94a3b8"];

    useEffect(() => {
    axios.get("http://localhost:3014/ObtenerDashboard")
      .then(res => setDatos(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuario(user);
    }
  }, []);


  return (
    <div className="dashboard-layout">
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


      <div className="main-container-flex">

        {/* SIDEBAR */}
        <Menu />

        {/* CONTENIDO */}
        <main className="dashboard-content">

          <div className="content-header">
            <h1>Panel de Control</h1>
            <p>Monitoreo de ventas y stock de productos</p>
          </div>

          {/* KPIs */}
          <div className="mini-cards-grid">

            <div 
              className="mini-card accent-blue" 
              onClick={() => navigate("/DetalleFactura")}
            >
               <div 
            className="card" 
            onClick={() => navigate("/DetalleFactura")}
            style={{ 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "15px", 
              padding: "20px", 
              background: "white", 
              borderRadius: "10px", 
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              flex: 1 
            }}
          >
            <div style={{ backgroundColor: "#e0f2fe", padding: "10px", borderRadius: "8px" }}>
              <FileText color="#0284c7" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#666" }}>FACTURAS</h3>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{datos.facturas}</p>
            </div>
          </div>
</div>
            <div 
              className="mini-card accent-yellow" 
              onClick={() => navigate("/Grafica")}
            >
               <div 
            className="card" 
            onClick={() => navigate("/Grafica")}
            style={{ 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "15px", 
              padding: "20px", 
              background: "white", 
              borderRadius: "10px", 
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              flex: 1 
            }}
          >
            <div style={{ backgroundColor: "#fef3c7", padding: "10px", borderRadius: "8px" }}>
              <DollarSign color="#d97706" size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#666" }}>VENTAS</h3>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>${datos.ventas}</p>
            </div>
          </div>

        </div>

          </div>

          {/* GRÁFICAS */}
          <div className="charts-section">

            <div className="chart-card">
              <h3><TrendingUp size={18} /> Ventas Mensuales</h3>
              <div className="canvas-container">
                <Doughnut 
                  data={{
                    labels: ventasMensuales?.map(i => i.mes) || [],
                    datasets: [{
                      data: ventasMensuales?.map(i => i.total) || [],
                      backgroundColor: modernPalette,
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "78%",
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>
            </div>

            <div className="chart-card">
              <h3><Package size={18} /> Distribución de Productos</h3>
              <div className="canvas-container">
                <Doughnut 
                  data={{
                    labels: ventasProductos?.map(i => i.producto) || [],
                    datasets: [{
                      data: ventasProductos?.map(i => i.total) || [],
                      backgroundColor: modernPalette,
                      borderWidth: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "78%",
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
    
  );
};

export default DashboardGraficas;