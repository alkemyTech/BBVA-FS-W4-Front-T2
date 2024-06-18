import React, { useEffect } from 'react';
import {  useNavigate, Outlet } from 'react-router-dom';
import { validateToken } from './Auth';

const ProtectedRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await validateToken();
      } catch (error) {
        navigate("/");
      }
    };

    checkToken();
  }, [navigate]);

  return <Outlet/>;
};

export default ProtectedRoutes;

