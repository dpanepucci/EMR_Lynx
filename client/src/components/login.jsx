import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loginData, setloginData] = useState({ username: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatusMessage(result.message || "Login failed.");
        return;
      }

      localStorage.setItem("emr_user", JSON.stringify(result.user));
      setStatusMessage("Login successful.");
      setloginData({ username: "", password: "" });
      navigate("/");
    } catch (error) {
      setStatusMessage("Unable to reach backend server.");
      console.error(error);
    }
  };

  return (
    <div id="login_main_page">
      <h1 id="welcomeheader">Welcome to Axis Lynx EMR</h1>
      <form id="login_form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            placeholder="username"
            value={loginData.username}
            onChange={(e) =>
              setloginData({ ...loginData, username: e.target.value })
            }
            id="username"
            name="username"
            required
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            placeholder="password"
            value={loginData.password}
            onChange={(e) =>
              setloginData({ ...loginData, password: e.target.value })
            }
            id="password"
            name="password"
            required
          ></input>
        </div>

        <button type="submit" id="login_btn">
          Login
        </button>
        {statusMessage && <p>{statusMessage}</p>}
        <div>
          <p id="dontHaveAccount">
            Don't have an account? <a href="/register">Register Here</a>
          </p>
        </div>
      </form>

      <footer id="footer_plug">
        <p id="createdBy">Created by: D.Panepucci</p>
        <br></br>
        <div id="footer_icons">
          <a
            href="https://github.com/dpanepucci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <img src="/icons/github.svg" width="44" height="44" alt="GitHub" />
          </a>
          <a
            href="https://linkedin.com/in/dylan-panepucci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <img
              src="/icons/linkedin.svg"
              width="44"
              height="44"
              alt="LinkedIn"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
