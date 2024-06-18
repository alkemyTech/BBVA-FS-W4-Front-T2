import * as React from 'react';
import Box from '@mui/material/Box';
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton href="https://facebook.com" sx={{ color: '#fff' }}>
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://twitter.com" sx={{ color: '#fff' }}>
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://linkedin.com" sx={{ color: '#fff' }}>
          <LinkedInIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton href="mailto:gatosmonteses@bbva.com" sx={{ p: 0, fontSize: 'inherit', mr: 2, color: '#fff' }}>
          <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '18px' }} />
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            gatosmonteses@bbva.com
          </Typography>
        </IconButton>
        <IconButton href="tel:+123456789" sx={{ p: 0, fontSize: 'inherit', color: '#fff' }}>
          <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '18px' }} />
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            +123 456 789
          </Typography>
        </IconButton>
      </Box>
      <Box sx={{ textAlign: 'center', color: '#fff' }}>
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          &copy; {new Date().getFullYear()} By Gatos Monteses
        </Typography>
      </Box>
    </Box>
  );
}

export default Pie;

