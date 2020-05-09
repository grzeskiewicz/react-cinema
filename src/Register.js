import React from 'react';
import { authServices } from './services.js';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.newUser = this.newUser.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleSurename = this.handleSurename.bind(this);
        this.handleTelNum = this.handleTelNum.bind(this);

        this.state = { email: '', password: '', name: '', surename: '', telnum: '', error: '', registered: false };

    }
    componentDidMount() { }
    componentWillUnmount() { }

    handleEmail(event) {
        const emailPattern = /\w@\w*\.\w/g;
        let result = emailPattern.test(event.target.value);
        if (result === false && event.target.value.length < 6) result = true;
        this.setState({ email: event.target.value, error: result ? '' : 'Wrong e-mail address!' }); //error: event.target.value.length > 4 && result ? '': 'Wrong e-mail address!'
    }

    handlePassword(event) {
        this.setState({ password: event.target.value });
    }
    handleName(event) {
        this.setState({ name: event.target.value });
    }
    handleSurename(event) {
        this.setState({ surename: event.target.value });
    }
    handleTelNum(event) {
        const telnumPattern = /\d{9}/g;
        //    const telnP2 = /\D/g;
        //   let res2 = telnP2.test(event.target.value);
        let result = event.target.value.length === 9 && telnumPattern.test(event.target.value);
        // if (result === false && event.target.value.length <9) result=true;
        //  if (res2) result = false;
        this.setState({ telnum: event.target.value, error: result ? '' : 'Wrong tel number!' });
    }

    newUser(event) {
        event.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            surename: this.state.surename,
            telephone: this.state.telnum
        };
        authServices.register(user)
            .then(res => {
                if (res.success) {

                } else {
                    this.setState({ error: res.msg })
                    console.log(res);
                }
            });


    }

    render() {
        return (
            <form id="user-register" onSubmit={this.newUser}>
                <input name='email' placeholder='E-mail' value={this.state.email} onChange={this.handleEmail} required></input>
                <input type="password" name='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} required></input>
                <input name='name' placeholder='Name' value={this.state.name} onChange={this.handleName} required></input>
                <input name='surename' placeholder='Surename' value={this.state.surename} onChange={this.handleSurename} required></input>
                <input name='telephone' size="9" maxLength="9" placeholder='Telephone number' value={this.state.telnum} onChange={this.handleTelNum} required></input>
                <button type='submit'>Sign-up</button>
                {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
            </form>
        );
    }
}



export default Register;