import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TextField, IconButton, InputAdornment, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const usePasswordInput = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [allRequirementsMet, setAllRequirementsMet] = useState(false);

  const requirements = useMemo(() => [
    { regex: /.{8,}/, text: 'Al menos 8 caracteres' },
    { regex: /[0-9]/, text: 'Al menos 1 número (0...9)' },
    { regex: /[a-z]/, text: 'Al menos 1 letra minúscula (a...z)' },
    { regex: /[^A-Za-z0-9]/, text: 'Al menos 1 símbolo especial (!...$)' },
    { regex: /[A-Z]/, text: 'Al menos 1 letra mayúscula (A...Z)' },
  ], []);

  const handlePasswordChange = useCallback((e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  useEffect(() => {
    const allMet = requirements.every((req) => req.regex.test(password));
    setAllRequirementsMet(allMet);
  }, [password, requirements]);

  const PasswordField = useCallback(() => (
    <Box>
      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        margin="dense"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="body2" sx={{ mt: 2 }}>
        La contraseña debe contener:
      </Typography>
      <List>
        {requirements.map((req, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={req.text}
              sx={{ color: req.regex.test(password) ? 'green' : 'red' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  ), [password, showPassword, handlePasswordChange, togglePasswordVisibility, requirements]);

  return {
    password,
    PasswordField,
    allRequirementsMet,
  };
};
