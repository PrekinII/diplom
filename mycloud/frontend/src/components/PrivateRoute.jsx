import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" />;

  return children;
};