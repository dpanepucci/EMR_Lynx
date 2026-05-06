import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('emr_user') || 'null');
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
