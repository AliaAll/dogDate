import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
} from "@mui/material";
//import React from "react";
import PetsIcon from "@mui/icons-material/Pets";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.js";

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const url = "http://localhost:8000/";
  const [profile, setProfile] = useState();
  const [eventParticipation, setEventParticipation] = useState([]);
  const [friendRequestStatus, setFriendRequestStatus] = useState();
  const [friendRequestClicked, setFriendRequestClicked] = useState(false);
  const [dogProfile_id, setDogProfile_id] = useState(
    location.state.dogProfile_id
      ? location.state.dogProfile_id
      : JSON.parse(sessionStorage.getItem("dogProfile")).id
  );
  const user_id = sessionStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`${url}dogProfile`, {
        params: { id: dogProfile_id },
      })
      .then(function (response) {
        setProfile(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${url}eventParticipation`, {
        params: {
          dogProfileId: dogProfile_id,
        },
      })
      .then(function (response) {
        setEventParticipation(response.data.events);
        console.log(response.data.events);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });

    axios
      .get(`${url}friendRequest`, {
        params: {
          sender_id: JSON.parse(sessionStorage.getItem("dogProfile")).id,
          recipent_id: dogProfile_id,
        },
      })
      .then(function (response) {
        setFriendRequestStatus(response.data.status);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  }, [dogProfile_id, friendRequestClicked]);

  const ownDog = () => {
    return user_id === profile.owner_id;
  };
  const sendFriendRequest = () => {
    axios
      .post(`${url}friendRequest`, {
        sender_id: JSON.parse(sessionStorage.getItem("dogProfile")).id,
        recipent_id: dogProfile_id,
        status: "sent",
      })
      .then(function (response) {
        setFriendRequestClicked(true);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  };

  const actionButton = () => {
    return ownDog() ? (
      <Button sx={{ float: "right", border: 2, padding: 0.2 }}>Edit</Button>
    ) : (
      friendButton()
    );
  };

  const handleFriendProfile = (id) => {
    setDogProfile_id(id);
  };

  const friendButton = () => {
    if (!friendRequestStatus) {
      return (
        <Button
          sx={{ float: "right", border: 2, padding: 0.2 }}
          onClick={sendFriendRequest}
        >
          {" "}
          Add friend
        </Button>
      );
    }
    if (friendRequestStatus === "sent") {
      return (
        <Button sx={{ float: "right", border: 2, padding: 0.2 }}>
          Awaiting response
        </Button>
      );
    }
    if (friendRequestStatus === "accepted") {
      return (
        <Button sx={{ float: "right", border: 2, padding: 0.2 }}>
          Friends!
        </Button>
      );
    }
    if (friendRequestStatus === "declined") {
      return (
        <Button sx={{ float: "right", border: 2, padding: 0.2 }}>
          Sorry, no friends
        </Button>
      );
    }
  };

  const handleEvent = (event) => {
    navigate("/events");
  };
  console.log(dogProfile_id);

  return (
    <>
      {profile && (
        <>
          <Header title={"Profile"} />
          <Grid
            container
            direction="row"
            alignItems="left"
            spacing={4}
            padding={5}
          >
            <Grid item xs={12} lg={6}>
              <Card raised>
                <CardHeader
                  action={actionButton()}
                  title={ownDog() ?  <Typography color="#47cc70">
                      Pawdy {profile.name}!
                    </Typography> :
                    <Typography color="#47cc70">
                      {profile.name}
                    </Typography>
                  }
                ></CardHeader>
                <CardMedia
                  sx={{ maxHeight: "20rem", maxWidth: "20rem", margin: "auto" }}
                  component="img"
                  alt="Profile picture"
                  image={`/uploads/${profile.image_url}`}
                />
                <CardContent>
                  {ownDog() && (
                    <Typography color="#19a645">
                      Looking PAW-some, {profile.name}!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6} sx={{}}>
              <Card raised>
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    alignItems="left"
                    spacing={1}
                    padding={1}
                  >
                    <Grid item xs={12} lg={5}>
                      <Typography>All about {profile.name}:</Typography>
                      <Typography>
                        <PetsIcon
                          sx={{
                            color: "#47cc70",
                            "&:hover": { color: "#006600" },
                          }}
                        />
                        Breed :{profile.breed}
                      </Typography>
                      <Typography>
                        <PetsIcon
                          sx={{
                            color: "#47cc70",
                            "&:hover": { color: "#006600" },
                          }}
                        />{" "}
                        Age :{profile.age}{" "}
                      </Typography>
                      <Typography>
                        <PetsIcon
                          sx={{
                            color: "#47cc70",
                            "&:hover": { color: "#006600" },
                          }}
                        />
                        {profile.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} lg={5}>
                      <Typography>Traits:</Typography>
                      {profile.traits.map((trait) => {
                        return (
                          <Typography>
                            <PetsIcon
                              sx={{
                                color: "#47cc70",
                                "&:hover": { color: "#006600" },
                              }}
                            />
                            {trait}
                          </Typography>
                        );
                      })}
                    </Grid>
                    <Grid item lg={2}>
                      {ownDog() &&<Button sx={{ float: "right", border: 2, padding: 0.2 }}>
                        Edit
                      </Button> }
                      
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card raised>
                <CardContent>
                  <Typography>Friends:</Typography>
                  <Grid container>
                    {profile.friends.map((friend) => {
                      return (
                        <>
                          <Grid item xs={2}>
                            <Avatar
                              onClick={() => handleFriendProfile(friend.id)}
                              alt="user avatar"
                              src={`/uploads/${friend.image_url}`}
                              sx={{ width: 45, height: 45 }}
                            />
                            <Typography>{friend.name}</Typography>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card raised>
                <CardContent>
                  <Typography>Events: </Typography>
                  {eventParticipation.map((event) => {
                    return (
                      <Card
                        endIcon={<CheckIcon />}
                        item
                        onClick={handleEvent}
                        sx={{
                          border: 1.5,
                          padding: 1.5,
                          margin: 2.5,
                          borderColor: "#19a645",
                        }}
                      >
                        <Typography color="#19a645">{event.date}</Typography>
                        <Typography color="#19a645">{event.time}</Typography>
                        <Typography color="#19a645">
                          {event.location}
                        </Typography>
                        <Typography color="#19a645">
                          {event.activity}
                        </Typography>
                        <Typography color="#47cc70"></Typography>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        
        </>
      )}
    </>
  );
}

export default Profile;
