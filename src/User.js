import React from 'react';
import Login from './Login';
import Register from './Register';
import './User.css';
import { authServices } from './services.js';
//import { headers } from './apiconnection.js';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.logout = this.logout.bind(this);
        this.showRegister= this.showRegister.bind(this);
        this.hideRegister=this.hideRegister.bind(this);
        this.state = { userLogged: '', showRegister: false }
    }

    componentDidMount() {
        authServices.loadUserCredentials();
        authServices.getInfo().then(res => {
            if (res.success) {
                this.props.loggedUsername(res.msg);
                this.setState({ authorised: true, userLogged: res.msg, showRegister: false });
            } else {
                this.setState({ authorised: false, showRegister: false });
            }
        })
    }

    getUserData(user) {
        this.props.loggedUsername(user);
        this.setState({ userLogged: user });


    }

    logout() {
        authServices.destroyUserCredentials();
        this.setState({ userLogged: '', showRegister: false });
        this.props.loggedUsername('');
    }


    showRegister() {
        this.setState({ showRegister: true});
    }

    hideRegister(){
        this.setState({ showRegister: false});

    }

    render() {
        return (
            <div className={this.props.className} id="user-wrapper">
                {this.state.userLogged !== '' ?
                    <div id="user-data">
                        <p>{this.state.userLogged}</p>
                        <button onClick={this.logout}>Logout</button>
                    </div> : ''}

                {this.state.userLogged === '' ?
                    <div id="user">
                        {this.state.showRegister === true ?
                            <div><p id="hide-register" onClick={this.hideRegister}>Login</p><Register></Register></div> :
                            <div><Login getUserData={this.getUserData}></Login> <p id="show-register" onClick={this.showRegister}>Register</p></div>}
                    </div>
                    : ''}
            </div>
        );

    }
}




export default User;