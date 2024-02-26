import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ element, isAuthenticated, ...rest }) {
  return isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/404" replace />
  );
}

export default ProtectedRoute;
