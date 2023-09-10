import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Grid,
  ThemeProvider,
  createTheme,
  MenuItem,
  Toolbar,
  Typography,
  Alert,
  MenuList,
  ButtonBase,
  Menu,
  Card,
  CardContent,
  CardMedia,
  Select,
  OutlinedInput,
} from "@mui/material";
//import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import CheckIcon from "@mui/icons-material/Check";
import appTheme from "./themes/theme";
import { useNavigate } from "react-router-dom";
import { maxWidth } from "@mui/system";
import logo1 from "./assets/logo1.png";
import Header from "./Header";

function Events() {
  const navigate = useNavigate();
  const url = "http://localhost:8000/";
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}events`, {})
      .then(function (response) {
        setEvents(response.data.rows);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  }, []);

  const handleParticipate = (event) => {
    axios
      .post(`${url}eventParticipation`, {
        eventId: event.target.id,
        dogProfileId: JSON.parse(sessionStorage.getItem("dogProfile")).id,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  };

  const handleCreate = (event) => {
    navigate("/createEvent");
  };

  return (
    <>
      {events && (
        <>
          <Header title={"Events"}></Header>
          <Button
            sx={{ margin: "20px", float: "right" }}
            variant="outlined"
            onClick={handleCreate}
          >
            Create your Event
          </Button>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {events.map((event, index) => {
              return (
                <Grid key={event.id} item xs={11} lg={7}>
                  <Card
                    raised
                    sx={{
                      border: 2.5,
                      borderColor: "#47CC70",
                    }}
                  >
                    <CardContent>
                      <div>
                      {index !== 0 ? <Button
                          id={event.id}
                          onClick={handleParticipate}
                          sx={{
                            float: "right",
                            border: 2,
                            padding: 0.5,
                            "&:hover": { color: "#47cc70" },
                          }}
                        >
                          Participate
                        </Button>: <Button
                        endIcon={<CheckIcon />}
                          id={event.id}
                          onClick={handleParticipate}
                          sx={{
                            float: "right",
                            border: 2,
                            padding: 0.5,
                            "&:hover": { color: "#47cc70" },
                          }}
                        >
                          Participating
                        </Button> }
                        
                      </div>
                      <Typography color="#19a645">{event.date}</Typography>
                      <Typography color="#19a645">{event.time}</Typography>
                      <Typography color="#47cc70">{event.location}</Typography>
                      <Typography color="#19a645">{event.activity}</Typography>
                      <Typography>{event.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
}

export default Events;
