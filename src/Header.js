import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo1 from "./assets/logo1.png";

function Header({title}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const dogProfile =  JSON.parse(sessionStorage.getItem("dogProfile"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDirectProfile = (event) => {
    const data = { dogProfile_id: JSON.parse(sessionStorage.getItem("dogProfile")).id };
    navigate('/profile', { state: data });
  };
  const handleDirectHome = (event) => {
    navigate("/home");
  };
  const handleDirectEvents = (event) => {
    navigate("/events");
  };

  const handleMessages = (event) =>{
    navigate("/messages");
  }

  const handleSignOut =(events) => {
    sessionStorage.clear()
    navigate("/")
  }

  return (
    <>
      <AppBar
        sx={{ backgroundColor: "white", marginBottom: 2 }}
        position="static"
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDirectProfile}>Profile</MenuItem>
            <MenuItem onClick={handleDirectHome}>Home</MenuItem>
            <MenuItem onClick={handleDirectEvents}>Events</MenuItem>
            <MenuItem onClick={handleMessages}>Messages</MenuItem>
            <MenuItem onClick={handleSignOut}> Sign Out</MenuItem>
          </Menu>
          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <img src={logo1} alt="logo" width="50" height="50" />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Avatar alt="user avatar"  
            src= 
              {`/uploads/${dogProfile.image_url}`}
              
            sx={{ width: 45, height: 45 }}
          />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;