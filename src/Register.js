import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./App.css";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  dividerClasses,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
//import React from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import appTheme from "./themes/theme";
import logo1 from "./assets/logo1.png";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PicProf from "./assets/PicProf.jpg";
import { UserContext } from "./UserContext";

function Register() {
  const navigate = useNavigate();
  const url = "http://localhost:8000/";
  const [registerDetails, setRegisterDetails] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  function handleSubmit() {
    axios
      .post(`${url}register`, {
        firstName: registerDetails.name,
        lastName: registerDetails.surname,
        email: registerDetails.email,
        password: registerDetails.password,
      })
      .then(function (response) {
        sessionStorage.setItem("userId", response.data.uuid);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  }

  function handleProfile() {
    console.log("Create Profile");
    navigate("/createProfile");
  }

  async function handleSP() {
    const valid = await validateValues(registerDetails);
    if (valid) {
      handleSubmit();
      handleProfile();
    }
  }

  const validateValues = (inputValues) => {
    return new Promise ((resolve) =>{
      setTimeout(() =>{
        let errs = {};
        if (!inputValues.email.match("@")) {
          errs.email = "Insert correct email address";
        }
        if (inputValues.password.length < 5) {
          errs.password = "Password too short";
        }
        if (!inputValues.name) {
          errs.name = "What is your name?";
        }
        if (!inputValues.surname) {
          errs.surname = "What is your surname?";
        }
        
        setErrors(errs);
        resolve(Object.keys(errs).length > 0 ? false: true);
      }, 1000)
    })
  };
  return (
    <>
      <AppBar sx={{ backgroundColor: "white" }} position="static">
        <Toolbar>
          <img src={logo1} alt="logo" width="50" height="50" />
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Register
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="welcome">
        <h1>Welcome</h1>
        <p>Register</p>
        <p style={{color:"#1d7516"}}>Just few things about you</p>
      </div>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
    
        <TextField
          required
          id="outlined-basic"
          label="Name"
          variant="outlined"
          type="Name"
          color="primary"
          margin="normal"
          value={registerDetails.name}
          onChange={(e) => {
            setRegisterDetails({ ...registerDetails, name: e.target.value });
          }}
        />  
        {errors.name && <p style={{color:"#9acd32"}}>{errors.name}</p>}
        
        <TextField
          required
          id="outlined-basic"
          label="Surname"
          variant="outlined"
          type="nickname"
          color="primary"
          value={registerDetails.surname}
          onChange={(e) =>
            setRegisterDetails({ ...registerDetails, surname: e.target.value })
          }
        />
        {errors.surname && <p style={{color:"#9acd32"}}>{errors.surname}</p>}
      
        <TextField
          required
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="email"
          color="primary"
          value={registerDetails.email}
          onChange={(e) =>
            setRegisterDetails({ ...registerDetails, email: e.target.value })
          }
        />
        {errors.email && <p style={{color:"#C62828"}}>{errors.email}</p>}
        
        <TextField
          required
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          color="primary"
          value={registerDetails.password}
          onChange={(e) =>
            setRegisterDetails({ ...registerDetails, password: e.target.value })
          }
        />
        {errors.password && <p style={{color:"#C62828"}}>{errors.password}</p>}

        <Button variant="outlined" type="button" onClick={handleSP}>
          Create <PetsIcon /> profile
        </Button>
      </Stack>
    </>
  );
}

export default Register;
