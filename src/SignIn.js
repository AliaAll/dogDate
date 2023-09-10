import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  Alert,
} from "@mui/material";
//import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";

import appTheme from "./themes/theme";
import { useNavigate } from "react-router-dom";
import { maxWidth } from "@mui/system";
import logo1 from "./assets/logo1.png";
import { UserContext } from "./UserContext";

function SignIn() {
  const navigate = useNavigate();
  const url = "http://localhost:8000/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popUp, setPopUp] = useState(false);
  const { setUserId } = useContext(UserContext);

  function handleSubmit() {
    axios
      .post(`${url}login`, {
        email: email,
        password: password,
      })
      .then(function (response) {
        setPopUp(false);
        sessionStorage.setItem("userId", response.data.uuid);
        axios
          .get(`${url}dogProfile`, {
            params: { id: response.data.dogProfile_id },
          })
          .then(function (response) {
            console.log(response);
            sessionStorage.setItem("dogProfile", JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
        navigate("/home");
      })
      .catch(function (error) {
        setPopUp(true);
        console.log(error.response.data.error);
      });
  }

  function handleRegister() {
    console.log("Register");
    navigate("/register");
  }

  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <AppBar sx={{ backgroundColor: "white" }} position="static">
        <Toolbar>
          <img src={logo1} alt="logo" width="50" height="50" />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sign-In
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="email"
          color="primary"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          color="primary"
          onChange={(e) => setPassword(e.target.value)}
        />
        {popUp && (
          <Alert severity="error">
            Something went wrong! <br />
            Check email or password again{" "}
          </Alert>
        )}

        <Button type="submit" onClick={handleSubmit}>
          {" "}
          Submit
        </Button>
        <Button type="reset" onClick={handleRegister}>
          Register
        </Button>
      </Stack>
    </>
  );
}

export default SignIn;
