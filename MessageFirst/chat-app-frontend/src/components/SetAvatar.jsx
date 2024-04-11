import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Loading from "../assets/loading.gif";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

function SetAvatar() {
  // open source, free: pass any random numbers at the end and it will generate random avatars
  const api = "https://api.multiavatar.com/123456";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  // While the avatars are loading, display the loading gif
  const [isLoading, setisLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  // toast allows an error message along with a second optional object of styling/functional options
  const toastOptions = {
    position: "bottom-left",
    // autoClose in milliseconds
    autoClose: 7000,
    pauseOnHover: true,
    draggable: true,
  };

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    }
    fetchData();
  }, []);

  async function setProfilePicture() {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      // data destructured from the axios api
      if (user.isAvatarImageSet === true) {
        setisLoading(false);
        navigate("/");
      } else {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        });
        setisLoading(true);
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          setisLoading(false);
          navigate("/");
        } else {
          <Container>
            <img src={Loading} alt="loading" className="loading" />
          </Container>;
          setProfilePicture();
        }
      }
    }
  }

  useEffect(() => {
    // Make sure function is async
    // Make sure function is async
    // Make sure function is async
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setisLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={Loading} alt="loading" className="loading" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Please pick an avatar to set as your profile icon!</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as your profile avatar
          </button>
        </Container>
      )}

      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #02bd82;
  height: 100vh;
  width: 100vw;
  gap: 2rem;
  .loading {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid yellow;
    }
  }
  .submit-btn {
    background-color: blue;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #230672;
    }
  }
`;
export default SetAvatar;
