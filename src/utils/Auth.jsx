


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

  let token = response.headers.get('authorization'); 
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  localStorage.setItem('token', token);
  return data;
};

const register = async (userName, firstName, lastName, birthDate, password, dni) => {
  const [year, month, day] = birthDate.split("-");
  const formattedBirthDate = `${day}-${month}-${year}`;

  const response = await fetch("http://localhost:8080/auth/register", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName,
      password,
      firstName,
      lastName,
      birthDate: formattedBirthDate,
      dni,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al registrar usuario');
  }

  const data = await response.json();

  let newToken = response.headers.get('authorization'); 
  if (newToken && newToken.startsWith('Bearer ')) {
    newToken = newToken.slice(7, newToken.length);
  }
  localStorage.setItem('token', newToken);
  return data;
};


const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no encontrado');
  }

  try {
    const response = await fetch("http://localhost:8080/auth/validate-token", {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado: Token no válido');
      } else {
        throw new Error('Error en la validación del token');
      }
    }

    return response.ok;
  } catch (error) {
    console.error('Error en la validación del token:', error);
    throw error;
  }
};


export {
  login,
  register,
  validateToken,
};