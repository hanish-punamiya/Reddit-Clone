import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

import { serverURL } from '../../utils/config';
import '../../styles/SingUp/SignUp.css';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: "",
      lName: "",
      email: "",
      password: "",
    }
  }

  updateFName = (e, value) => {
    this.setState({ fName: e.target.value });
  }

  updateLName = (e) => {
    this.setState({ lName: e.target.value });
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  updatePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  attemptSignUp = (e) => {
    e.preventDefault();
    const { fName, lName, email, password } = this.state;
    const user = {
      firstName: fName,
      lastName: lName,
      email,
      password,
    }
    axios.post(`${serverURL}/api/user/register`, user)
      .then((res) => {
        swal({
          title: 'Success',
          text: 'Account Created',
          icon: 'success',
        }).then(() => {
          this.props.history.push('/login');
        });
      }).catch((err) => {
        swal({
          title: 'Failed',
          text: 'Email In Use',
          icon: 'error',
        })
      });
  }

  cancelSignUp = () => {
    this.props.history.push('/login');
  }

  render() {
    return(
      <div className="sign-up-grid">
        <form className="sign-up-form" onSubmit={this.attemptSignUp}>
          <TextField
            label="First Name"
            variant="outlined"
            onChange={this.updateFName}
            style={{
              gridArea: 'fName',
            }}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            onChange={this.updateLName}
            style={{
              gridArea: 'lName',
            }}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            onChange={this.updateEmail}
            style={{
              gridArea: 'email',
            }}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            inputProps={{
              minLength: 6,
              maxLength: 12
            }}
            onChange={this.updatePassword}
            style={{
              gridArea: 'password',
            }}
            required
          />
          <Button
            type="submit"
            variant="outlined"
            style={{
              gridArea: 'sign-up',
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            onClick={this.cancelSignUp}
            style={{
              gridArea: 'cancel',
            }}
          >
            Cancel
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);