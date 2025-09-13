import React, { Children } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


// Example: Replace with your actual authentication logic
const isAuthenticated = () => {
    return  useSelector((state) => state.auth.user !== null) 
};

const ProtectedRoute = () => {
    return isAuthenticated() ? Children: <Navigate to="/login"  />;
};

export default ProtectedRoute;