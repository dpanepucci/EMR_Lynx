import './login.css';
import GithubIcon from '../assets/icons/github.svg?react';
import LinkedIn from '../assets/icons/LinkedIn.svg?react';

function Login () {
    return (
        <>
        <h1>Welcome to Axis Lynx EMR</h1>
        <form id="login_form">
            <div>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required></input>
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required></input>
            </div>

            <button type="submit" id="login">Login</button>
            <div>
                <p>Don't have an account? <a href="/api/register">Register Here</a></p>
            </div>
        </form>

        <footer>
            <p>Created by: D.Panepucci</p>
            <div id="footer_icons">
                <a
                href="https://github.com/dpanepucci"
                target="_blank"
                rel="noopener noreferrer">
                <GithubIcon width={44} />
                </a>
                <a
                href="https://linkedin.com/in/dylan-panepucci"
                target="_blank"
                rel="noopener noreferrer">
                <LinkedIn width={44} />
                </a>
            </div>
        </footer>

        </>
    )
};

export default Login;
