import { useEffect, useState } from "react";
import axios from "axios";
import Menu from "../componentes/menu";
import { Link, useNavigate } from "react-router-dom";
import "../css/dashboard.css";
// Importamos los iconos
import { FileText, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [datos, setDatos] = useState({
    facturas: 0,
    ventas: 0
  });

  const navigate = useNavigate();

 useEffect(() => {

const user = JSON.parse(localStorage.getItem("usuario"));

if (user) {

setUsuario(user);

axios
.get(`http://localhost:3014/ObtenerDashboard/${user.id}`)
.then(res => setDatos(res.data))
.catch(err => console.log(err));

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
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const nombreFotoNueva = response.data.foto;
      const userActualizado = { ...usuario, foto: nombreFotoNueva };
      localStorage.setItem("usuario", JSON.stringify(userActualizado));
      setUsuario(userActualizado);
      alert("Foto actualizada con éxito");
      setMostrarMenu(false);
    } catch (error) {
      console.error(error);
      alert("Error al subir la foto");
    }
  };

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
              src={usuario.foto ? `http://localhost:3014/uploads/${usuario.foto}?t=${new Date().getTime()}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="perfil"
              style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
              onClick={() => setMostrarMenu(!mostrarMenu)}
            />

            {mostrarMenu && (
              <div className="menu-perfil" style={{ position: 'absolute', top: '50px', right: '0', background: 'white', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100, minWidth: '150px' }}>
                <p style={{ color: 'black', fontSize: '12px', margin: '0 0 10px 0' }}>Cambiar foto:</p>
                <input type="file" onChange={(e) => setArchivo(e.target.files[0])} style={{ fontSize: '10px', marginBottom: '10px', width: '100%' }} />
                <button onClick={SubirFoto} style={{ width: '100%', padding: '5px', marginBottom: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar Foto</button>
                <hr />
                <Link to="/perfil" style={{ display: 'block', margin: '10px 0', color: '#333', textDecoration: 'none' }}>Mi Perfil</Link>
                <button onClick={CerrarSesion} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold', width: '100%', textAlign: 'left' }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <Menu>
        <div className="dashoard">Dashboard</div>
        
        <div className="cards" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          
          {/* Card Facturas */}
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

          {/* Card Ventas */}
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
      </Menu>
    </div>
  );
};

export default Dashboard;