import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const token = localStorage.getItem("authToken");

    const user = token ? true : null;
    return user ? <Outlet></Outlet> : <Navigate to="/login"></Navigate> 
}

export default ProtectedRoutes;