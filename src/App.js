import Principal from "./Archivos/Pagina_Principal";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registro from "./Archivos/Registro"
import InicioSesion from "./Archivos/InicioSesion"
import RecuperarPassword from "./Archivos/RecuperarPassword";
import ReestablecerPassword from "./Archivos/ReestablecerPassword"
import Menu from "./componentes/menu"
import Perfil from "./Archivos/perfil"
import Dashboard  from "./Archivos/Dashoard"
import Factura from "./Archivos/Factura"
import ProteccionPagina from "./Archivos/ProteccionPagina"
import Crud from "./Archivos/Crud"
import Productos from "./Archivos/Productos"
import Comprobante from "./Archivos/Comprobante";
import DetalleFactura  from "./Archivos/DetalleFactura";
import Grafica from "./Archivos/Grafica"
import Ejemplo1 from "./Archivos/ejemplo1"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/Registro" element={<Registro/>} />
        <Route path="/InicioSesion" element={<InicioSesion/>} />
        <Route path="/RecuperarPassword" element={<RecuperarPassword/>} />
        <Route path="/ReestablecerPassword/:Token" element={<ReestablecerPassword/>} />
        <Route path="/Munu" element={<Menu/>}/>
        <Route path ="/Perfil" element ={<Perfil/>}/>
        <Route path ="/Dashboard" element ={<ProteccionPagina><Dashboard/></ProteccionPagina>}/>
        <Route path="/Factura" element={<ProteccionPagina><Factura/></ProteccionPagina>}/>
        <Route path="/ProteccionPagina" element={<ProteccionPagina/>}/>
        <Route path="/Crud" element={<Crud/>}/>
        <Route path="/Productos" element={<Productos/>}/>
        <Route path="/Comprobante" element={<Comprobante/>}/>
        <Route path="/DetalleFactura" element={<DetalleFactura/>}/>
        <Route path="/Grafica" element={<Grafica/>}/>
        <Route path="/Ejemplo1" element={<Ejemplo1/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;