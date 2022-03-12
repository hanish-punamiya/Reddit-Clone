import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import jwt_decode from 'jwt-decode';

import { serverURL } from '../../utils/config';
import '../../styles/Login/Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  attemptLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };
    axios.post(`${serverURL}/api/user/login`, user)
      .then((res) => {
        const { token } = res.data;
        const stripped = token.substring(7);
        const { email, id } = jwt_decode(stripped).user;
        localStorage.setItem('id', id);
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
        swal({
          title: 'Success',
          text: 'Log In Successful',
          icon: 'success',
        }).then(() => {
          this.props.history.push("/dash");
        });
      }).catch((err) => {
        swal({
          title: 'Failed',
          text: 'Invalid Credentials',
          icon: 'error',
        });
      });
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  updatePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div className="login-page">
        <form className="login-form" onSubmit={this.attemptLogin}>
          <TextField
            className="login-form-item"
            label="email"
            variant="outlined"
            type="email"
            onChange={this.updateEmail}
            required
          />
          <TextField
            className="login-form-item"
            label="password"
            variant="outlined"
            type="password"
            onChange={this.updatePassword}
            required
          />
          <Button
            className="login-form-item"
            variant="outlined"
            type="submit"
          >
            Login
          </Button>
          <Link to="/signup">Need An Account?</Link>
        </form>
      </div>   
    );
  }
}

export default withRouter(Login);