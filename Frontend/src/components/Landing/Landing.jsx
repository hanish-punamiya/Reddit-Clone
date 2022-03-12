import React from 'react';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.history.push('/communities_search');
  }

  render() {
    return (
      <div>
        <Button>Login</Button>
        <Button>Sign Up</Button>
      </div>
    );
  }
}

export default withRouter(Landing);
