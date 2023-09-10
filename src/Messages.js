import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
   
    Button,
    
  } from "@mui/material";
import axios from "axios";


const Messages = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const url = "http://localhost:8000/";
  const [loading, setLoading] = useState(false);

  const acceptFriendship = (id, sender_id) =>{
    axios
    .post(`${url}friendRequest`, {
      id: id,
      status: "accepted",
    })
    .then(function (response) {
     setLoading(true);
    })
    .catch(function (error) {
      console.log(error.response.data.error);
    });

    axios.post(`${url}friends`, {
      id: sender_id,
      friendId: JSON.parse(sessionStorage.getItem("dogProfile")).id,
    })
    .then(function (response) {
     setLoading(true);
    })
    .catch(function (error) {
      console.log(error.response.data.error);
    });
  }

  const declineFriendship = (id) =>{
    axios
    .post(`${url}friendRequest`, {
      id: id,
      status: "declined",
    })
    .then(function (response) {
     setLoading(true);
    })
    .catch(function (error) {
      console.log(error.response.data.error);
    });

  }
  useEffect(() => {
    axios
      .get(`${url}dogProfile`, {
        params: { id: JSON.parse(sessionStorage.getItem("dogProfile")).id },
      })
      .then(function (response) {

        response.data.friendRequests.forEach((friendRequest) => {
            const requestId = friendRequest.id
          axios.get(`${url}dogProfile`, {
            params: { id: friendRequest.sender_id }
          })
          .then(function(response){
            console.log(response)
            const responseData = {...response.data, request_id: requestId, sender_id: friendRequest.sender_id}
            setFriendRequests([...friendRequests, responseData])
        })
        .catch(function(err){
            console.log(err);
        })
        })
       
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  console.log(friendRequests)

  return (
    <>
      <Header title="Messages" />
      {friendRequests.length > 0 && friendRequests.map((friendRequest) => {
        return <>Hi I'm {friendRequest.name} you want to be friends?
        <Button onClick={() => acceptFriendship(friendRequest.request_id, friendRequest.sender_id)}>yes</Button>
         <Button onClick={() => declineFriendship(friendRequest.request_id)}>no</Button></>;
      })}
    </>
  );
};

export default Messages;
