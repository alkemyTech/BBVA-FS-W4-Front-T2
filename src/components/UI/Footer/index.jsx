import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import '/src/index.css';

function Pie() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#182346', top: 'auto', bottom: 0 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3, margin: '2px', paddingBottom: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" href="https://facebook.com">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" href="https://linkedin.com">
              <LinkedInIcon />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body4" color="inherit"  >
              <IconButton color="inherit" href="mailto:info@example.com">
                <EmailIcon sx={{  verticalAlign: 'middle', mr: 1 , fontSize:'45px'}} />
                gatosmonteses@bbbva.com
              </IconButton>
            </Typography>
            <Typography variant="body4" color="inherit">
              <IconButton color="inherit" href="tel:+123456789">
                <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize:'45px'}} />
                +123 456 789
              </IconButton>
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body4" color="inherit">
              &copy; {new Date().getFullYear()} By Gatos Monteses
            </Typography>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Pie;
