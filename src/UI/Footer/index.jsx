import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import './footer.css'; // Importa el archivo CSS de estilos

function Pie() {
  return (
    <footer className="footer">
      <div className="social-icons">
        <IconButton href="https://facebook.com">
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://twitter.com">
          <TwitterIcon />
        </IconButton>
        <IconButton href="https://linkedin.com">
          <LinkedInIcon />
        </IconButton>
      </div>
      <div className="contact-info">
        <a href="mailto:gatosmonteses@bbva.com" className="contact-item">
          <EmailIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '18px' }} />
          <span>gatosmonteses@bbva.com</span>
        </a>
        <a href="tel:+123456789" className="contact-item">
          <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '18px' }} />
          <span>+123 456 789</span>
        </a>
      </div>
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} By Gatos Monteses</p>
      </div>
    </footer>
  );
}

export default Pie;
