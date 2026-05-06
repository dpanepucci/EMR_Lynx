import './register.css';

function Register () {
    return (
        <div id='register_page'>
        <h1 id='registerHeader'>Register Page</h1>
            <form id="register_form">
            <div>
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" required></input>
            </div>
            <div>
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" required></input>
            </div>
            <div>
                <label htmlFor="registerPassword">Registration Code: </label>
                <input type="password" id="registerpassword" name="registration" required></input>
            </div>

            <button type="submit" id="register_btn">Register</button>
            <p id='backToLogin'><a href="/login">Back to Login</a></p>
            </form>
        </div>
    )
};

export default Register;