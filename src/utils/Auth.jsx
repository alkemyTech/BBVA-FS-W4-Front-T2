


const login = async (userName, password, dni) => {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, password, dni }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data = await response.json();
  const token = response.headers.get('AUTHORIZATION');
  localStorage.setItem('token', token);
  return data;
};


const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no encontrado');
  }

  const response = await fetch("http://localhost:8080/auth/validate-token", {
    method: 'GET',
    headers: {
      'AUTHORIZATION': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token no válido');
  }

  return response.ok;
};

export {
  login,
  validateToken,
};