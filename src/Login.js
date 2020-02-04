import React from 'react';
import { authServices } from './services.js';
import { headers } from './apiconnection.js';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = { username: '', password: '' };
    }
    handleLogin(event) {
        event.preventDefault();
        const user = {
            email: this.state.username,
            password: this.state.password
        };
        authServices.login(user)
            .then(res => {
                console.log(res);
                if (res.success) {
                    authServices.getInfo().then(res => {
                        if (res.success) {
                            console.log("Zalogowano");
                           // socket.emit('logged', this.state.username);
                            const admin = res.role === "admin" ? true : false;
                            this.setState({ authorised: true, role: res.role, admin: admin, password: '' });
                            this.props.getUserData(user.email);
                        } else {
                            this.setState({ authorised: false });
                        }
                    })
                } else {
                    this.setState({ authorised: false });
                }
            });
    }
    handleUsername(event) {
        this.setState({ username: event.target.value });
    }
    handlePassword(event) {
        this.setState({ password: event.target.value });
    }



    /*
     */
    render() {


        return (
            <div className='login'>
                <form onSubmit={this.handleLogin}>
                    <input name='username' autoFocus placeholder='Your username' value={this.state.username} onChange={this.handleUsername} required></input>
                    <input type='password' id='password' name='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} required></input>
                    <button type='submit'>Login</button>
                </form>

            </div>
        );
    }
}




export default Login;