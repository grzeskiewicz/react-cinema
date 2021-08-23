import React from 'react';
import Login from './Login';
import Register from './Register';
import './css/User.css';
import { authServices } from './services.js';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.logout = this.logout.bind(this);
        this.showRegister = this.showRegister.bind(this);
        this.hideRegister = this.hideRegister.bind(this);
        this.setUsername=this.setUsername.bind(this);
        this.state = { userLogged: '', showRegister: false, username: '' }
    }

    componentDidMount() {
        authServices.loadUserCredentials();
        authServices.getInfo().then(res => {
            console.log(res);
            if (res.success) {
                console.log(res.msg)
                this.props.loggedUser(res.msg);
                this.setState({ authorised: true, userLogged: res.msg, showRegister: false });
            } else {
                this.setState({ authorised: false, showRegister: false });
            }
        })
    }

    getUserData(user) {
        console.log(user)
        this.props.loggedUser(user);
        this.setState({ userLogged: user });
    }

    logout() {
        authServices.destroyUserCredentials();
        this.setState({ userLogged: '', showRegister: false });
        this.props.loggedUser('');
    }


    showRegister() {
        this.setState({ showRegister: true });
    }

    hideRegister() {
        this.setState({ showRegister: false });
    }

    setUsername(username) {
        this.setState({ username: username.email });
        console.log(username)
        alert("User registered!")
    }

    render() {
        return (
            <div className={this.props.className} id="user-wrapper">
                {this.state.userLogged !== '' ?
                    <div id="user-data">
                        <p>{this.state.userLogged.username}</p>
                        <button onClick={this.logout}>Logout</button>
                    </div> : ''}

                {this.state.userLogged === '' ?
                    <div id="user">
                        {this.state.showRegister === true ?
                            <div><p id="hide-register" onClick={this.hideRegister}>Login</p><Register setUsername={this.setUsername} hideRegister={this.hideRegister}></Register></div> :
                            <div><Login key={this.state.username} username={this.state.username} getUserData={this.getUserData}></Login> <p id="show-register" onClick={this.showRegister}>Register</p></div>}
                    </div>
                    : ''}
            </div>
        );

    }
}




export default User;