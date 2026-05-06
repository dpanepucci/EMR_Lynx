import './register.css';

function Register () {
    return (
        <div id='register_page'>
        <h1>Register Page</h1>
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
            </form>
        </div>
    )
};

export default Register;