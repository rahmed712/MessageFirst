import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // toast allows an error message along with a second optional object of styling/functional options
  const toastOptions = {
    position: "bottom-left",
    // autoClose in milliseconds
    autoClose: 7000,
    pauseOnHover: true,
    draggable: true,
  };

  // only runs the first time the component is loaded
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  function handleChange(event) {
    // Destructure the current values
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // If there are no errors, call our API
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        // Pass the user information to the local storage
        //
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        // If everything is good to go, set the user to local storage and naviagte to the chat container
        navigate("/");
      }
    }
  }

  // TODO: come back to check if there is a toast error, border that input with a red border
  function handleValidation() {
    const { username, password } = values;
    if (password === "") {
      // npm install react-toastify for error notifications
      toast.error("Email and Password are required", toastOptions);
      return false;
    } else if (username.length === "") {
      toast.error("Email and Password are required", toastOptions);
      return false;
    }
    return true;
  }

  return (
    <>
      <FormContainter>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="app-logo">
            <img src={Logo} alt="Logo" />
            <h1>CHATTY</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/signup">Signup Here</Link>
          </span>
        </form>
      </FormContainter>
      <ToastContainer />
    </>
  );
}

const FormContainter = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #02bd82;

  form {
    color: #fffcfc;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    /* background-color: #00000040; */
    background-color: #b6b6b6;
    border-radius: 1rem;
    padding: 4rem 5rem;

    button {
      background-color: #02bd82;
      font-size: 1rem;
      text-transform: uppercase;
      font-weight: bold;
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      /* click finger mouse pointer when hovering over button */
      cursor: pointer;
      transition: 0.5s ease-in-out;

      &:hover {
        background-color: #0470f5;
      }
    }

    input {
      background-color: #d8d8d883;
      padding: 1rem;
      border: 0.2rem solid #000000;
      border-radius: 0.5rem;
      color: black;
      font-weight: bold;
      width: 100%;
      font-size: 1rem;
      /* These elements apply when we focus/highlight on the particular input field */
      &:focus {
        outline: none;
        /* When we click on an indiviual input field */
        border: 0.2rem solid #0470f5;
      }
    }
  }

  span {
    color: white;
    a {
      color: blue;
      text-transform: none;
      text-decoration: none;
      font-weight: bold;
    }
  }

  .app-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #fffcfc;
    }
  }
`;

export default Login;
