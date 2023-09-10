import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, Grid } from "@mui/material";
import { Link } from "react-router-dom";
//import React from "react";

import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Header from "./Header.js";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import * as ReactDOMServer from "react-dom/server";
import io from "socket.io-client";
import { generateRandomCoordinatesAroundEdinburgh } from "./utils.js";

const socket = io("http://localhost:8000");

function Home() {
  const navigate = useNavigate();
  const url = "http://localhost:8000/";
  const [anchorEl, setAnchorEl] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState(null);
  const [profilesOnMap, setProfilesOnMap] = useState({});

  const defaultIcon = new L.icon({
    iconUrl: icon,
  });

  useEffect(() => {

    //setUserLocation(generateRandomCoordinatesAroundEdinburgh());
    //setUserLocation(randomLocation);
    //socket.emit('locationUpdate', {id:JSON.parse(sessionStorage.getItem("dogProfile")).id, location: userLocation});
    axios
      .get(`${url}dogProfile`, {
        params: { id: JSON.parse(sessionStorage.getItem("dogProfile")).id },
      })
      .then(function (response) {
        setProfile(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get(`${url}events`, {})
      .then(function (response) {
        setEvents(response.data.rows);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
      });
  }, []);

  useEffect(() =>{
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(position)
        setUserLocation(generateRandomCoordinatesAroundEdinburgh());
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  })


  useEffect(() => {
    socket.on("locationUpdate", (newLocation) => {
      axios
        .get(`${url}dogProfile`, {
          params: { id: newLocation.id },
        })
        .then(function (response) {
          let tempProfiles = { ...profilesOnMap };
          tempProfiles[newLocation.id] = {
            ...response.data,
            location: newLocation.location,
          };
          setProfilesOnMap(tempProfiles);
        })
        .catch(function (error) {
          console.log(error);
        });
    });

    return () => {
      socket.off("locationUpdate");
    };
  });

  useEffect(() => {
    socket.emit("locationUpdate", {
      id: JSON.parse(sessionStorage.getItem("dogProfile")).id,
      location: userLocation,
    });
  }, [userLocation]);

  const getProfileIcon = (image_url) => {
    
    return new L.DivIcon({
      className: "custom-icon",
      html: ReactDOMServer.renderToString(
        <Avatar
          src={`/uploads/${image_url}`}
          sx={{ width: 45, height: 45 }}
        ></Avatar>
      ),
    });
  };
  return (
    <>
      <Header title={"Home"}></Header>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10}>
          {profile && userLocation && (
            <MapContainer
              center={userLocation}
              zoom={12}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={userLocation}
                icon={getProfileIcon(profile.image_url)}
              >
                <Popup>
                  Hi I'm{" "}
                  <Link to="/profile" state={{ dogProfile_id: profile.id }}>
                    {profile.name}{" "}
                  </Link>
                </Popup>
              </Marker>
              {Object.entries(profilesOnMap).length > 0 ? Object.entries(profilesOnMap).map((profile) => {
                if(profile[1].location){
                  console.log(profile[1])
                  return <Marker position={profile[1].location}
                  icon ={getProfileIcon(profile[1].image_url)}>
                    <Popup>
                  Hi I'm{" "}
                  <Link to="/profile" state={{ dogProfile_id: profile.id }}>
                    {profile.name}{" "}
                  </Link>
                </Popup>
                  </Marker>
                }
              }): <></>}
              {events.map((event) => {
                return (
                  <>
                    <Marker
                      position={[event.lat, event.lon]}
                      icon={defaultIcon}
                    >
                      <Popup>
                        {event.date} <br /> {event.time} <br />
                        {event.activity}
                      </Popup>
                    </Marker>
                  </>
                );
              })}
            </MapContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default Home;
