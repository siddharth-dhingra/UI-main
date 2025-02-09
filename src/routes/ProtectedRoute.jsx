/* eslint-disable react/prop-types */
// src/routes/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // Optionally show a spinner or some loading text
    return <div>Checking authentication...</div>;
  }

  // If no user, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content
  return children;
}

export default ProtectedRoute;
