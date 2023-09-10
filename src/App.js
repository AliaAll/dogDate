import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import SignIn from "./SignIn";
import Register from "./Register";
import "leaflet/dist/leaflet.css";
import CreateProfile from "./CreateProfile";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import Home from "./Home";
import Profile from "./Profile";
import Messages from "./Messages";
import Header from "./Header";
import { UserProvider } from "./UserContext";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";

function App() {
  return (
    <UserProvider>
      <GeoapifyContext apiKey="d81b2cda0a254089a5ec6da4bdcac27f">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/createProfile" element={<CreateProfile />}></Route>
            <Route path="/events" element={<Events />}></Route>
            <Route path="/createEvent" element={<CreateEvent />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/messages" element={<Messages />}></Route>
          </Routes>
        </BrowserRouter>
      </GeoapifyContext>
    </UserProvider>
  );
}

export default App;
