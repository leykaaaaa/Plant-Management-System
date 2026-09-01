import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const storedUser =
        localStorage.getItem("buildBloomUser");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;