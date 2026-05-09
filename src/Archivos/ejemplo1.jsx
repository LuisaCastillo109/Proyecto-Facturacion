import React,{useState,useEffect} from "react";
import axios from "axios"

const Ejemplo1 =()=>{

const [usuario,setUsuario]=useState([]);
const [ConsultarUsuario,setConsultarUsuario]=useState(null)
const [loading,setLoading]=useState(true)
const [editarUsuario,setEditarUsuario]=useState()

useEffect(()=>{
axios.get("http://localhost:3014/ObtenerUsuarios")
.then(res=>setUsuario(res.data))
.catch(err=>console.log("Error al obtener los usuarios"))
.finally(()=>setLoading(false))
}, []);


const EliminarUsuario =(id)=>{
axios.delete(`http://localhost:3014/eliminar/${id}`)
.then(res=>setUsuario(res.data))
.catch(err=>console.log("Error al eliminar el usuario"))
}

if (loading) return <p>cargando....</p>
if (usuario.length ===0) return  <p>No hay usuarios que mostrar</p>

return (
<>
<h2>INFORMACION USUARIOS</h2>
{usuario.map((u)=>(
<div key ={u.id} style={{border: "1px solid black", marginBottom :"10px"}}>
<p>Nombre : {u.nombre}</p>
<p>Apellido : {u.apellido}</p>
<button onClick={()=>setConsultarUsuario(u)}>Ver Informacion</button>
<button onClick={()=>setConsultarUsuario(u.id)}>Eliminar</button>
<button onClick={()=>setEditarUsuario(u)}>Editar</button>
</div>
))}
{ConsultarUsuario && (
<div style ={{border: "1px solid black", marginBottom :"10px"}}>
<h2>Datos del usuario</h2>
<p>Nombre :{ConsultarUsuario.nombre}</p>
<p>Apellido :{ConsultarUsuario.apellido}</p>
<p>Correo :{ConsultarUsuario.correo}</p>
<p>Telefono :{ConsultarUsuario.telefono}</p>
<p>Estado :{ConsultarUsuario.estado}</p>
</div>
)}

{editarUsuario && (
<div>
<input type ="text"
value ={editarUsuario.nombre}
onChange={(e)=>setEditarUsuario({
...editarUsuario,nombre : e.target.value
})}
/>

<input type ="text"
value ={editarUsuario.apellido}
onChange={(e)=>setEditarUsuario({
...editarUsuario,apellido : e.target.value
})}
/>

<input type ="email"
value ={editarUsuario.correo}
onChange={(e)=>setEditarUsuario({
...editarUsuario,correo : e.target.value
})}
/>

<input type ="text"
value ={editarUsuario.telefono}
onChange={(e)=>setEditarUsuario({
...editarUsuario,telefono : e.target.value
})}
/>

<input type ="text"
value ={editarUsuario.estado}
onChange={(e)=>setEditarUsuario({
...editarUsuario,estado : e.target.value
})}
/>
</div>
)}
</>
)}
export default Ejemplo1;





