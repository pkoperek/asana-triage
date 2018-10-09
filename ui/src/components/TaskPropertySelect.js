import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  }
});

class TaskPropertySelect extends Component {

  constructor(props) { 
    super(props);

    this.state = {
      'chosen': this.props.chosen
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ 'chosen': value });

    if(this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render() {
    const { classes } = this.props;
    
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="">{this.props.name}</InputLabel>
        <Select
          value={this.state.chosen}
          onChange={this.handleChange}
          disabled={this.props.disabled}
        >
        {this.props.options
          .sort((l, r) => l.sort - r.sort)
          .map(option => {
          return (
            <MenuItem value={option.id}>{option.name}</MenuItem>
          );
        })}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(TaskPropertySelect);
