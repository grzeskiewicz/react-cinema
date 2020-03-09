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
        this.state = { userLogged: '' }
    }

    componentDidMount() {
        authServices.loadUserCredentials();
        authServices.getInfo().then(res => {
            if (res.success) {
                this.props.loggedUsername(res.msg);
                this.setState({ authorised: true, userLogged: res.msg });
                console.log(this.state.userLogged);
            } else {
                console.log(res);
                this.setState({ authorised: false });
            }
        })
    }

    getUserData(user) {
        this.props.loggedUsername(user);
        this.setState({ userLogged: user });


        console.log("Zalogowan user", user);
    }

//<div id="user-logged"><p>{this.state.userLogged}</p><button onClick={this.logout}>Logout</button></div>
    logout() {
        authServices.destroyUserCredentials();
        this.setState({ userLogged: '' });
    }

    render() {
        return (
            <div id="user">
                {this.state.userLogged === '' ?
                    <div>
                        <Login getUserData={this.getUserData}></Login>
                        <Register></Register>
                    </div>
                    : ''}
            </div>
        );

    }
}




export default User;