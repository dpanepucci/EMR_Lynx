import './login.css';

function Login () {
    return (
    <div id='login_main_page'>
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

            <button type="submit" id="login_btn">Login</button>
            <div>
                <p>Don't have an account? <a href="/api/register">Register Here</a></p>
            </div>
        </form>
    </div>
    )
};

export default Login;
