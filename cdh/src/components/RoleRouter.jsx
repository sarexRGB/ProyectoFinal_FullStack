import { useContext } from "react";
import { AuthContext } from "@/services/AuthContext";
import { Navigate } from "react-router-dom";

function RoleRoute({ children, allowedRoles = [] }) {
    const { rol, roles, loading } = useContext(AuthContext);

    // Normaliza roles a array
    const userRoles = Array.isArray(roles) && roles.length ? roles : rol ? [rol] : [];

    if (loading) return <p>Cargando...</p>;
    if (!allowedRoles.some(r => userRoles.includes(r))) return <Navigate to="/" replace />;

    return children;
}

export default RoleRoute;