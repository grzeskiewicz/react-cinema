import React from 'react';
import { authServices } from './services.js';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.newUser = this.newUser.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.state = { username: '', password: '' };

    }
    componentDidMount() { }
    componentWillUnmount() { }

    handleUsername(event) {
        this.setState({ username: event.target.value });
    }

    handlePassword(event) {
        this.setState({ password: event.target.value });
    }

    newUser(event) {
        event.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password,
            role: "user"
        };

        console.log(user);

        //register handler
       /* authServices.register(user)
            .then(res => {
                if (res.success) {
                    socket.emit('newuser', user);
                } else {

                }
            });*/


    }

    render() {
        return (
            <div id="user-register">
                <form onSubmit={this.newUser}>
                    <input name='username' autoFocus placeholder='Username' value={this.state.username} onChange={this.handleUsername} required></input>
                    <input type="password" name='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} required></input>
                    <button type='submit'>Create user</button>
                </form>
            </div>
        );
    }
}



export default Register;