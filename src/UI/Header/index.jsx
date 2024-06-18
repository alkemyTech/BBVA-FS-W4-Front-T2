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
  "Transferir",
  "Depositar",
  "Mis Transacciones",
  "Inversiones",
  "Balance",
  "Pagos"
];
const settings = ["Mi Perfil", "Datos de cuenta", "Cerrar Sesion"];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [logout, setLogout] = React.useState(false);
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
    setLogout(true);
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
            href="#app-bar-with-responsive-menu"
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
                  component={NavLink}
                  to={`/${page.toLowerCase()}`}
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
                    onClick={
                      setting === "Cerrar Sesion"
                        ? handleClickLogout
                        : handleCloseUserMenu
                    }
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