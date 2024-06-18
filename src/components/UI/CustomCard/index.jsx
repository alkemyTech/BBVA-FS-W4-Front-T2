import React from 'react';
import { Grid, Paper, Typography, IconButton } from '@mui/material';

const CustomCard = ({ text, apiValue, icon }) => {
  return (
    <Grid item xs={4}>
      <Paper style={{ padding: 20 }}>
        <IconButton style={{ marginBottom: 10 }} color="primary">
          {icon}
        </IconButton>
        <Typography variant="h6">{text}</Typography>
        <Typography variant="body1">Valor desde API: {apiValue}</Typography>
      </Paper>
    </Grid>
  );
};

export default CustomCard;
