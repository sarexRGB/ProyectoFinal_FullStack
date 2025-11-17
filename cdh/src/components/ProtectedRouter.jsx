import { useContext } from "react";
import { AuthContext } from "@/services/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <p>Cargando...</p>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute;