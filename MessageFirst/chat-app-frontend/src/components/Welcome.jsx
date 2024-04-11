import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChatRobot from "../assets/chat-robot.gif";
import Logout from "./Logout";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    async function fetchData() {
      setUserName(
        await JSON.parse(localStorage.getItem("chat-app-user")).username
      );
    }
    fetchData();
  }, []);
  return (
    <Container>
      <img src={ChatRobot} alt="Chat Robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
      <Logout />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  align-self: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
