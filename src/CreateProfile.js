import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./App.css";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Autocomplete,
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
import { breeds } from "./dogBreeds.js";
//import React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import appTheme from "./themes/theme";
import logo1 from "./assets/logo1.png";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import PicProf from "./assets/PicProf.jpg";
import { UserContext } from "./UserContext";

function CreateProfile() {
  const url = "http://localhost:8000/";
  const [dogProfileDetails, setDogProfileDetails] = useState({
    name: "",
    breed: "",
    gender: "",
    age: "",
    traits: [],
    avatar: "",
  });
  const [avatar, setAvatar] = useState();

  const onFileChange = (e) => {
    console.log(e.target.files);
  };
  //const { userId } = useContext(UserContext);
  const userId = sessionStorage.getItem('userId');
  console.log(userId);

  function handleCreate() {
    axios
      .post(`${url}dogProfile`, {
        name: dogProfileDetails.name,
        breeed: dogProfileDetails.breed,
        gender: dogProfileDetails.gender,
        age: dogProfileDetails.age,
        avatar: dogProfileDetails.avatar,
        traits: dogProfileDetails.traits,
        owner_id: userId,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  }

  function handleTrait(event) {
    if (dogProfileDetails.traits.includes(event.target.value)) {
      const newTraits = dogProfileDetails.traits.filter((trait) => {
        return trait !== event.target.value;
      });
      setDogProfileDetails({ ...dogProfileDetails, traits: newTraits });
    } else {
      setDogProfileDetails({
        ...dogProfileDetails,
        traits: [...dogProfileDetails.traits, event.target.value],
      });
    }
  }

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
            Create Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="welcome">
        <h1>Welcome</h1>
        <p>Create your DOG profile</p>
        <p>
          <i>Tell us about your pup!</i>
        </p>
      </div>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <TextField
          sx={{ marginBottom: "0px" }}
          required
          id="outlined-basic"
          label="Name"
          variant="outlined"
          type="text"
          color="primary"
          margin="normal"
          onChange={(e) =>
            setDogProfileDetails({ ...dogProfileDetails, name: e.target.value })
          }
        />
        <Autocomplete
          value={dogProfileDetails.breed}
          onChange={(event, newValue) => {
            setDogProfileDetails({ ...dogProfileDetails, breed: newValue });
          }}
          disablePortal
          id="combo-box-demo"
          options={breeds}
          sx={{ width: 225 }}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              {...params}
              label="Breed"
              color="primary"
              margin="normal"
              onChange={(e) =>
                setDogProfileDetails({
                  ...dogProfileDetails,
                  breed: e.target.value,
                })
              }
            />
          )}
        />
        <FormControl sx={{ m: 1, minWidth: 220 }}>
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Gender"
            onChange={(e) =>
              setDogProfileDetails({
                ...dogProfileDetails,
                gender: e.target.value,
              })
            }
          >
            <MenuItem value={"F"}>♀️ Girl</MenuItem>
            <MenuItem value={"M"}>♂️ Boy</MenuItem>
            <MenuItem value={"n/a"}>Prefer not to say</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="outlined-basic"
          label="Age"
          variant="outlined"
          type="number"
          color="primary"
          onChange={(e) =>
            setDogProfileDetails({ ...dogProfileDetails, age: e.target.value })
          }
        />
        <div className="mid">
          <p>✨Tell us about the personality of your Dog✨</p>
        </div>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="sociable"
                onChange={handleTrait}
              />
            }
            label="Sociable"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="active"
                onChange={handleTrait}
              />
            }
            label="Active"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="playful"
                onChange={handleTrait}
              />
            }
            label="Playful"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="curious"
                onChange={handleTrait}
              />
            }
            label="Curious"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="gentle"
                onChange={handleTrait}
              />
            }
            label="Gentle"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="anxious"
                onChange={handleTrait}
              />
            }
            label="Anxious"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="calm"
                onChange={handleTrait}
              />
            }
            label="Calm"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="adventurer"
                onChange={handleTrait}
              />
            }
            label="Adventurer"
          />
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                value="shy"
                onChange={handleTrait}
              />
            }
            label="Shy"
          />
        </FormGroup>
        <div className="mid">
          <p>✨Upload a cute photo ✨</p>
          <p>Like this one</p>
          <Avatar
            alt="Remy Sharp"
            src={PicProf}
            sx={{ width: 200, height: 200 }}
          />
        </div>
        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={onFileChange}
          />
        </Button>
        <Button
          variant="outlined"
          startIcon={<PetsIcon />}
          onClick={handleCreate}
        >
          Create
        </Button>
      </Stack>
    </>
  );
}

export default CreateProfile;
