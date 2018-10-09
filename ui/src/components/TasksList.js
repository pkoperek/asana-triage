import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Task from './Task';

const styles = theme => ({
  table: { 
    minWidth: 700,
  }
});

class TasksList extends Component {

  render() {
    const { classes } = this.props;

    return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
              <TableCell>Quick decision</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Project</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.tasks.map(task => {
              return (
                <Task 
                  task={task}
                  taskUpdateCallback={this.props.taskUpdateCallback}
                />
              );
            })}
          </TableBody>
        </Table>
    );
  }
}

export default withStyles(styles)(TasksList);
