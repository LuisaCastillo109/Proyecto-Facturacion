import {Navigate} from "react-router-dom";

const ProteccionPagina =({children})=>{
const usuario = localStorage.getItem("usuario");

if (!usuario){
return <Navigate to="/"></Navigate>
}
return children
}

export default ProteccionPagina;