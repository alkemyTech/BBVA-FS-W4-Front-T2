import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { validateToken } from './Auth';
import { useDispatch } from 'react-redux';
import { clearUser } from '../Redux/slice/userSlice';
import Header from '../UI/Header'; // Importa el componente de Header

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isValid = await validateToken();
        
      } catch (error) {
        console.error('Error al validar el token:', error);
        dispatch(clearUser());
        setLogout(true); 
        navigate('/');
      }
    };

    checkToken();
  }, [dispatch, navigate]);

  return (
  <>
  <Header logout={logout} setLogout={setLogout} />
  <Outlet/>
  </>)
};

export default ProtectedRoutes;


