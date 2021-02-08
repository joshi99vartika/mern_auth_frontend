import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { email, password, passwordCheck, displayName };
      if (password.length > 8) {
        if (password.match(/[0-9]/)) {
          if (password.match(/[a-z]/)) {
            if (password.match(/[A-Z]/)) {
              if (password.match(/[@#$%^&*]/)) {
                await Axios.post(
                  "http://localhost:5000/users/register",
                  newUser
                );
                const loginRes = await Axios.post(
                  "http://localhost:5000/users/login",
                  {
                    email,
                    password,
                  }
                );
                setUserData({
                  token: loginRes.data.token,
                  user: loginRes.data.user,
                });
                localStorage.setItem("auth-token", loginRes.data.token);
                history.push("/");
              } else {
                console.log("please include one special character");
              }
            } else {
              console.log("please include one Capital letter");
            }
          } else {
            console.log("please include one small letter");
          }
        } else {
          console.log("please include one digit");
        }
      } else {
        console.log("Password length should be greater than 8");
      }
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };
  return (
    <div className="page">
      <h2>Register</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => setError(undefined)} />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Verify password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        <label htmlFor="register-display-name">Display name</label>
        <input
          id="register-display-name"
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
