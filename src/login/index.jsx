import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import openEyesLogo from '../assets/logo.svg'; // Gatito con los ojos abiertos
import closedEyesLogo from '../assets/logocloseeyes.svg'; // Gatito con los ojos cerrados

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setError(true);
    } else {
      setError(false);
      console.log('Username:', username);
      console.log('Password:', password);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleLogin}
    >
      <img
        src={isPasswordFocused ? closedEyesLogo : openEyesLogo}
        alt="Logo"
        style={{ width: '200px', marginBottom: '20px' }}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={error && username === ''}
        helperText={error && username === '' ? 'Username is required.' : ''}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setIsPasswordFocused(true)}
        onBlur={() => setIsPasswordFocused(false)}
        error={error && password === ''}
        helperText={error && password === '' ? 'Password is required.' : ''}
      />
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
}
