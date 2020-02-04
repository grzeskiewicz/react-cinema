import React from 'react';
import Login from './Login';
import Register from './Register';
import './User.css';
import { authServices } from './services.js';
import { headers } from './apiconnection.js';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.state = { userLogged: '' }
    }

    componentDidMount() {
        let hehe=headers.entries();
        for (const el of hehe){
            console.log(el);
        }
        console.log(window.localStorage);
        authServices.getInfo().then(res => {
            if (res.success) {
                console.log(res);
                this.setState({ authorised: true, userLogged: '' });
            } else {
                console.log(res);
                this.setState({ authorised: false });
            }
        })
    }

    getUserData(user) {
        this.setState({ userLogged: user });
        console.log("Zalogowan user", user);
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