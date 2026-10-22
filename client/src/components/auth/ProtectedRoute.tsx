import React from 'react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client/react';
import { isAuthenticatedVar, isLoadingVar, userVar } from '@/apollo/apollo-vars';

const ProtectedRoute = ({
  requiredRoles,
  children,
}: {
  requiredRoles?: string[];
  children: React.ReactNode;
}) => {
  const isLoading = useReactiveVar(isLoadingVar);
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const user = useReactiveVar(userVar);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRoles && !requiredRoles.some((role: string) => user?.role.includes(role))) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
