import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import {
 
  Button,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
//import React from "react";

import PetsIcon from "@mui/icons-material/Pets";
import Header from "./Header";
import AddressAutoComplete from "./AddressAutoComplete";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const navigate = useNavigate();
  const url = "http://localhost:8000/";
  const [eventsDetails, setEventsDetails] = useState({
    location: "",
    date: "",
    activity: "",
    description: "",
  });

  function handleCreate() {
    axios
      .post(`${url}events`, {
        location: eventsDetails.location,
        date: eventsDetails.date,
        activity: eventsDetails.activity,
        description: eventsDetails.description,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
      navigate("/event")
  }

  const setLocation = (location) =>{
    
    setEventsDetails({...eventsDetails, location:location})
  }

  return (
    <>
      <Header title={"Events"}></Header>

      <div className="welcome">
        <h1>Create an event</h1>
      </div>

      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <FormControl sx={{ m: 1, minWidth: 220 }}>

        <AddressAutoComplete setLocation={setLocation} />
        
       
          <TextField
            id="outlined-basic"
            label="Activity"
            variant="outlined"
            type="text"
            color="primary"
            margin="normal"
            onChange={(e) =>
              setEventsDetails({ ...eventsDetails, activity: e.target.value })
            }
          />
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            type="date"
            color="primary"
            margin="normal"
            onChange={(e) =>
              setEventsDetails({ ...eventsDetails, date: e.target.value })
            }
          />
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            type="time"
            color="primary"
            margin="normal"
            onChange={(e) =>
              setEventsDetails({ ...eventsDetails, time: e.target.value })
            }
          />
          <TextField
            height="300px"
            width="400px"
            id="outlined-basic"
            variant="outlined"
            type="text"
            color="primary"
            margin="normal"
            placeholder="Description"
            multiline
            rows={4}
            onChange={(e) =>
              setEventsDetails({
                ...eventsDetails,
                description: e.target.value,
              })
            }
          />
          <Button
            variant="outlined"
            startIcon={<PetsIcon />}
            onClick={handleCreate}
            
          >
            Create
          </Button>
        </FormControl>
      </Stack>

      
    </>
  );
}

export default CreateEvent;
