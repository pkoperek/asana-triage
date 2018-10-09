import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TasksListContainer from './components/TasksListContainer'
import SignIn from './components/SignIn';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const API_URL = 'https://asana-triage.appspot.com/api/';

const styles = theme => ({});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'jwtToken': null,
      'errorSnackbarOpen': false
    };

    this.authorize = this.authorize.bind(this);
  }

  authorize(username, password) {
    fetch(
      API_URL + 'login',
      { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': username,
          'password': password
        })
      }
    ).then(response => {
      if(response.status == 200) {
        return response.json();
      }
      if(response.status == 401) {
        throw new Error('Incorrect user or password!');
      }

      throw new Error('Error! Backend returned status code: ' + response.status);
    }).then(asJson => {
      this.setState({jwtToken: asJson['jwt']}); 
      console.log('Received JWT token: ' + this.state.jwtToken);
    }).catch(error => {
      this.setState({
        'error': error.toString(),
        'errorSnackbarOpen': true
      });
    }); 
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ 'errorSnackbarOpen': false });
  };

  render() {
    const doesNotHaveToken = !this.state.jwtToken;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        {doesNotHaveToken && 
          <SignIn signInCallback={this.authorize}/>}
        {this.state.jwtToken && 
          <TasksListContainer jwtToken={this.state.jwtToken} />}
				<Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.errorSnackbarOpen}
          autoHideDuration={5000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.error}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
