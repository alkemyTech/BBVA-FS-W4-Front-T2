import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "/src/assets/logo.svg";
import { Logout } from "./Logout";

const pages = [
  "Home",
  "Transferir",
  "Depositar",
  "Transacciones",
  "Inversiones",
  "Mis Cuentas",
  "Pagos"
];
const settings = ["Mis datos", "Cerrar Sesion"];

function Header({ logout, setLogout }) { // Recibe logout y setLogout como props
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const userName = useSelector((state) => state.user.userName);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickLogout = () => {
    setLogout(true); // Actualiza el estado de logout a true al hacer clic en "Cerrar Sesión"
  };

  const handlePageChange = (page) => {
    if (page === 'Transferir') {
      navigate('/transferir/');
    } else if (page === 'Datos de Cuenta') {
      navigate('/MisDatos'); // Navegar a /MisDatos cuando se selecciona "Datos de Cuenta"
    } else {
      navigate(`/${page.toLowerCase().replace(' ', '-')}`);
    }
    handleCloseNavMenu();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#2c3e76",
        boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <Container sx={{ flexGrow: 1 }}>
        <Toolbar>
          <Typography
            className=""
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "karla",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            WildCat
          </Typography>
          <Button onClick={() => navigate("/")} sx={{ color: "white" }}>
            <img src={logo} alt="Logo" style={{ maxHeight: "50px" }} />
          </Button>
          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
            {userName &&
              pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
          </Box>

          {userName ? (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userName} src="/static/images/avatar/2.jpg" />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Cerrar Sesion") {
                        handleClickLogout(); // Al hacer clic en "Cerrar Sesión", se activa setLogout(true)
                      } else if (setting === "Mis datos") {
                        navigate("/MisDatos");
                        handleCloseUserMenu();
                      } else {
                        handleCloseUserMenu();
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              component={NavLink}
              to="/"
              sx={{ color: "white", display: "block" }}
            ></Button>
          )}
        </Toolbar>
      </Container>

      {logout && <Logout logout={logout} setLogout={setLogout} />} 
    </AppBar>
  );
}

export default Header;