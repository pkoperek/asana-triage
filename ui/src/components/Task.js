import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TaskPropertySelect from './TaskPropertySelect';

const BACKLOG_TAG = {
  'id': 387389802871068, 
  'gid': '387389802871068', 
  'name': 'backlog'
}

const HIGH_PRI_TAG = {
  'id': 101740015535654, 
  'gid': '101740015535654', 
  'name': 'high-pri',
  'sort': 1
}

const LOW_PRI_TAG = {
  'id': 101740015535677, 
  'gid': '101740015535677', 
  'name': 'low-pri',
  'sort': 3
}

const MID_PRI_TAG = {
  'id': 101740015535681, 
  'gid': '101740015535681', 
  'name': 'mid-pri',
  'sort': 2
}

const TODAY_TAG = {
  'id': 387296041137873, 
  'gid': '387296041137873', 
  'name': 'today'
}

const THIS_WEEK_TAG = {
  'id': 387389802871031, 
  'gid': '387389802871031', 
  'name': 'this-week'
}

const THIS_MONTH_TAG = {
  'id': 381404447510255, 
  'gid': '381404447510255', 
  'name': 'this-month'
}

const BAG_OF_TASKS_TAG = {
  'id': 425507466485436, 
  'gid': '425507466485436', 
  'name': 'bag-of-tasks'
}          

const DOMOWE_PRJ = {'id': 103417268581931, 'name': 'Domowe', 'sort': 1};

const projects = [
  DOMOWE_PRJ,
  {'id': 597468636740539, 'name': 'startertasks.com', sort: 2},
  {'id': 113407059888515, 'name': 'Firma', 'sort': 3},
  {'id': 101922149690363, 'name': 'PHD', 'sort': 4},
  {'id': 113407059888577, 'name': 'Edukacja', 'sort': 5},
  {'id': 103934013220439, 'name': 'Pomysły', 'sort': 6},
  {'id': 107548345775070, 'name': 'Książki', 'sort': 7},
  {'id': 257322038141255, 'name': 'Praca', 'sort': 8},
  {'id': 102621072319719, 'name': 'Filmy', 'sort': 9}
];

const priorities = [
  HIGH_PRI_TAG,
  MID_PRI_TAG,
  LOW_PRI_TAG,
  {'id': 110842514827418, 'name': 'super-high-pri', 'sort': 4},
  {'id': 235174947941362, 'name': 'ultra-super-duper-high-pri', 'sort': 4}
];

const DEFAULT_STATE = {
  'isUpdating': false,
  'project': DOMOWE_PRJ.id,
  'priority': MID_PRI_TAG.id
};

class Task extends Component {

  freshState() {
    return Object.assign({}, DEFAULT_STATE);
  }

  constructor(props) {
    super(props);

    this.updateTask = this.updateTask.bind(this);
    this.moveToToday = this.moveToToday.bind(this);
    this.moveToThisWeek = this.moveToThisWeek.bind(this);
    this.moveToBacklog = this.moveToBacklog.bind(this);
    this.rememberNewPriority = this.rememberNewPriority.bind(this);
    this.rememberNewProject = this.rememberNewProject.bind(this);

    this.state = this.freshState();

    console.log("Creating a component with id: " + this.props.task.id);
  }

  updateTask(addTags) {
    this.setState({ 'isUpdating': true });
    this.props.taskUpdateCallback({
      'id': this.props.task.id,
      'project': this.state.project,
      'tags': {
        'add': addTags,
        'remove': [
          BAG_OF_TASKS_TAG.id
        ]
      }
    });
  }

  moveToToday() {
    this.updateTask([
      HIGH_PRI_TAG.id,
      BACKLOG_TAG.id,
      TODAY_TAG.id,
      THIS_WEEK_TAG.id,
      THIS_MONTH_TAG.id
    ]);
  }

  moveToThisWeek() {
    this.updateTask([
      this.state.priority, 
      BACKLOG_TAG.id,
      THIS_WEEK_TAG.id,
      THIS_MONTH_TAG.id
    ]);
  }

  moveToBacklog() {
    this.updateTask([
      BACKLOG_TAG.id,
      this.state.priority
    ]); 
  }
 
  rememberNewPriority(priorityId) {
    this.setState({ 'priority': priorityId })
  }
  
  rememberNewProject(projectId) {
    this.setState({ 'project': projectId })
  }

  componentDidUpdate(prevProps) {
    // detect if parent component is reusing the component with a new task
    if(this.props.task.id !== prevProps.task.id) {
      this.setState(this.freshState());
    }
  }

  render() {
    const task = this.props.task;

    return ( 
      <TableRow key={task.id}>
        <TableCell component="th" scope="row">
          {task.name}
        </TableCell>
        <TableCell>
          {this.state.isUpdating && <CircularProgress size={12}/>}
        </TableCell>

        <TableCell >
          <Button disabled={this.state.isUpdating} size="small" onClick={this.moveToToday} color="primary">today</Button>
          <Button disabled={this.state.isUpdating} size="small" onClick={this.moveToThisWeek} color="secondary">this-week</Button>
        </TableCell>

        <TableCell >
          <TaskPropertySelect 
            chosen={this.state.priority}
            options={priorities} 
            name="Priorities"
            onChange={this.rememberNewPriority}
            disabled={this.state.isUpdating}
          />
        </TableCell>
        <TableCell>
          <TaskPropertySelect 
            chosen={this.state.project}
            options={projects} 
            name="Projects"
            onChange={this.rememberNewProject}
            disabled={this.state.isUpdating}
          /> 
        </TableCell>
        <TableCell>
          <Button disabled={this.state.isUpdating} size="small" onClick={this.moveToBacklog}>backlog</Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default Task;
