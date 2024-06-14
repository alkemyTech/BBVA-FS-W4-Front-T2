// AuthChecker.jsx

import React, { useEffect } from 'react';
import { validateToken } from './Auth'; // Ajusta la importación según la ubicación de tu archivo Auth.js
import { useNavigate } from 'react-router-dom';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await validateToken();
        // Token válido, permitir acceso
      } catch (error) {
        // Token inválido, redirigir al login
        console.error('Token no válido:', error.message);
        navigate('/');
      }
    };

    checkTokenValidity();
  }, [navigate]);

  return children; // Renderiza los hijos si el token es válido
};

export default AuthChecker;

