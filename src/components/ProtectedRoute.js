import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("access_token");

  // If no access token, redirect to login page
  if (!accessToken) {
    return <Navigate to="/" />;
  }


  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;
