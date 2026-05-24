import React from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios"; // Lo necesitamos para avisarle al backend
import "../css/comprobante.css";

const Comprobante = () => {
  const { state } = useLocation();
  const { factura } = state || {};
  const vendedor = JSON.parse(localStorage.getItem("usuario"));

  if (!factura) return <h2>No hay datos</h2>;

  const formatear = (num) => new Intl.NumberFormat("es-CO").format(num);


  const notificarYEnviarCorreo = async () => {
    try {
      const res = await axios.post(`http://localhost:3014/EnviarFacturaFisica/${factura.id}`, 
      {
      id_cliente: 
      factura.id_cliente || factura.cliente_id 
      });

      alert("Factura enviada al correo del cliente con éxito!");
    } catch (error) {
      console.error(error);
      alert("El archivo aún no está en la carpeta o el nombre no coincide (Debe ser factura_ID.pdf)");
    }};

  return (
    <div className="comprobante-container">
      <div className="factura-paper">
        {/* ENCABEZADO SUPERIOR */}
        <div className="header-grid">
          <div className="logo-section">
            <img src="/imagenes/logo.png" alt="logo" className="logo-siigo" />
          </div>
          <div className="empresa-details">
            <h1>MISAMOO S.A.S</h1>
            <p className="nit">NIT : 809,736,794 - 1</p>
            <p>Bogotá D.C. - BOGOTA - COLOMBIA</p>
            <p>Tel: 3106072362</p>
            <p>Responsable de IVA</p>
          </div>
          <div className="qr-section">
            <QRCodeCanvas value={`factura-${factura.id}`} size={80} />
          </div>
        </div>

        {/* BLOQUE TÍTULO FACTURA */}
        <div className="factura-titulo-box">
          <div className="titulo-izq">
             <div className="row-grid">
                <span className="label">Cliente</span>
                <span className="value">{factura.nombre} {factura.apellido}</span>
                <span className="label">Teléfono</span>
                <span className="value">{factura.telefono}</span>
             </div>
             <div className="row-grid">
                <span className="label">NIT</span>
                <span className="value">{factura.documento}</span>
                <span className="label">Vendedor</span>
                <span className="value">{vendedor ? vendedor.nombre : "VENDEDOR PRINCIPAL"}</span>
             </div>
          </div>
          <div className="titulo-der">
            <h4>FACTURA DE VENTA</h4>
            <p className="folio">No: {factura.id}</p>
            <div className="fechas">
                <p>Generación: {new Date(factura.fecha).toLocaleDateString()}</p>
                <p>Vencimiento: {new Date(factura.fecha).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <table className="tabla-siigo">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cant</th>
              <th>V. Unit</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.codigo || '001'}</td>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>{formatear(item.precio)}</td>
                <td>{formatear(item.precio * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SECCIÓN INFERIOR: TOTALES Y LETRAS */}
        <div className="footer-factura">
          <div className="letras-y-pagos">
            <p><strong>VALOR EN LETRAS</strong></p>
            <p className="texto-letras">VALOR TOTAL EN PESOS M/CTE</p>
            <div className="metodo-pago-box">
                <strong>CONDICION DE PAGO:</strong> {factura.metodo_pago}
            </div>
          </div>
          <div className="totales-box">
            <div className="total-row"><span>Total Bruto</span> <span>{formatear(factura.subtotal)}</span></div>
            <div className="total-row"><span>IVA</span> <span>{formatear(factura.iva)}</span></div>
            <div className="total-row final"><span>Total a Pagar</span> <span>$ {formatear(factura.total)}</span></div>
          </div>
        </div>

        {/* 🔘 TUS DOS BOTONES DE CONTROL EN PANTALLA */}
        <div className="no-print" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => window.print()} className="btn-print">
            1. Imprimir / Guardar PDF
          </button>
          
          <button onClick={notificarYEnviarCorreo} className="btn-email" style={{ backgroundColor: "#28a745", color: "white" }}>
            2. Enviar PDF por Correo
          </button>
        </div>

      </div>
    </div>
  );
};

export default Comprobante;