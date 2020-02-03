import React from 'react';
import Login from './Login';
import Register from './Register';
import './User.css';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.state = { userLogged: '' }
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