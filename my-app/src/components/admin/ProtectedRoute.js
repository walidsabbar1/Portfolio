import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/admin/login" />;
  }
  
  return children;
}
