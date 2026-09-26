import React from 'react';
import { Navigate } from 'react-router-dom';

export const SignUpPage = () => {
  return <Navigate to="/login?tab=signup" replace />;
};

export default SignUpPage;
