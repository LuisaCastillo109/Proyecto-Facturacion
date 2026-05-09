import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/perfil.css"

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [fotoArchivo, setFotoArchivo] = useState(null);

  // 👇 nuevos estados editables
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
      setUsuario(user);
      setCorreo(user.correo);
      setTelefono(user.telefono);
    }
  }, []);

  const subirFoto = async () => {
    if (!fotoArchivo) {
      alert("Seleccione una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("foto", fotoArchivo);

    try {
      const response = await axios.put(
        `http://localhost:3014/SubirFoto/${usuario.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const nuevaFoto = response.data.foto;
      const usuarioActualizado = { ...usuario, foto: nuevaFoto };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);

      alert("Foto actualizada con éxito");
    } catch (error) {
      console.log(error);
      alert("Error al subir foto");
    }
  };

  // 👇 actualizar datos
  const actualizarDatos = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3014/ActualizarPerfil/${usuario.id}`,
        { correo, telefono }
      );

      const usuarioActualizado = {
        ...usuario,
        correo,
        telefono,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);

      alert("Datos actualizados correctamente");
    } catch (error) {
      console.log(error);
      alert("Error al actualizar datos");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
  <div className="perfil-container">
    <div className="perfil-card">
      <h2>Mi Perfil</h2>

      <div className="perfil-content">

        {/* IZQUIERDA FOTO */}
        <div className="perfil-foto">
          <img
            src={
              usuario.foto
                ? `http://localhost:3014/uploads/${usuario.foto}?t=${new Date().getTime()}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="perfil"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoArchivo(e.target.files[0])}
          />

          <button className="btn-foto" onClick={subirFoto}>
            Actualizar Foto
          </button>
        </div>

        {/* DERECHA FORM */}
        <div className="perfil-form">
          <div>
            <label>Nombre</label>
            <input value={usuario.nombre} disabled />
          </div>

          <div>
            <label>Apellido</label>
            <input value={usuario.apellido} disabled />
          </div>

          <div>
            <label>Correo</label>
            <input
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div>
            <label>ID</label>
            <input value={usuario.id} disabled />
          </div>

          <button className="btn-guardar" onClick={actualizarDatos}>
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  </div>
);
};

export default Perfil;