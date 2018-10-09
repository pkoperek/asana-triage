import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TasksList from './TasksList';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const API_URL = 'https://<FILL ME IN>.appspot.com/api/';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  }
});

class TasksListContainer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      'isLoading': true,
      'isError': false,
    };

    this.updateTask = this.updateTask.bind(this);
  }
  
  componentDidMount() {
    fetch(
      API_URL + 'triage',
      { 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.jwtToken
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(tasks => {
        if(tasks.length === 0) {
          this.fetchDoneGif();
        } else {
          this.setState({
            'isLoading': false,
            'tasks': tasks
          }); 
        }
      })
      .catch(error => 
        this.setState({
          'isLoading': false,
          'isError': true,
          'error': error
        })
      );
  }

  fetchDoneGif() {
    fetch('https://api.tenor.com/v1/random?q=done+here')
      .then(response => {
        return response.json();
      })
      .then(obj => {
        var randomGifUrl = obj['results'][0]['media'][0]['gif']['url'];
        this.setState({
          'isLoading': false,
          'gifUrl': randomGifUrl
        });
      });
  }
  
  updateTask(taskToUpdate) {
    fetch(API_URL + 'updatetask', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this.props.jwtToken
      },
      body: JSON.stringify(taskToUpdate)
    }).then(response => {
      return response.text();
    }).then(returned => {
      if(returned === 'ok') {
        var tasks = this.state.tasks;
        var indexToDelete = tasks.findIndex(e => e.id === taskToUpdate.id);
        tasks.splice(indexToDelete, 1);
        this.setState({ 'tasks': tasks });

        if(tasks.length === 0) {
          this.fetchDoneGif();
        }
      } else {
        alert('Error while updating the task. Returned value: ' + returned);
      }
    });
  }

  render() {
    const { classes } = this.props;

    var content = null;

    if(this.state.isError) {
      content = 
        <Typography>
          Error ocurred while fetching data:<br/>
          {this.state.error.toString()}
        </Typography>;
    } else if(this.state.isLoading) {
      content = 
        <Grid container justify = "center">
          <CircularProgress className={classes.progress} /> 
        </Grid>
    } else if(this.state.gifUrl) {
      content = 
        <Grid container justify = "center">
          {this.state.gifUrl && <img src={this.state.gifUrl} /> }
        </Grid>
    } else {
      content = 
        <TasksList
          tasks={this.state.tasks}
          taskUpdateCallback={this.updateTask}
        />;
    }

    return (
      <div>
        <Paper className={classes.root} elevation={2}>
          {content}
        </Paper>
      </div>
    );
  }
}

TasksListContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TasksListContainer);
