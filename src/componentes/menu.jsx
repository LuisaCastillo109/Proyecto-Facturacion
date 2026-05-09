import { Link } from "react-router-dom";
import { LayoutDashboard, Users, Box, FilePlus } from "lucide-react";
import "../css/menu.css"; // Asegúrate de que esta ruta sea correcta

const Menu = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      
      {/* SIDEBAR */}
      <div className="sidebar-container">


        <Link to="/crud" className="sidebar-link">
          <div className="icon-badge purple">
            <Users size={20} strokeWidth={2} />
          </div>
          <span>Clientes</span>
        </Link>

        <Link to="/Productos" className="sidebar-link">
          <div className="icon-badge orange">
            <Box size={20} strokeWidth={2} />
          </div>
          <span>Productos</span>
        </Link>

        <Link to="/factura" className="sidebar-link">
          <div className="icon-badge green">
            <FilePlus size={20} strokeWidth={2} />
          </div>
          <span>Nueva Factura</span>
        </Link>

      </div>

      {/* CONTENIDO */}
      <div className="main-content">
        {children}
      </div>

    </div>
  );
};

export default Menu;