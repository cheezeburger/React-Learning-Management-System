import React, {Component, PureComponent} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'rsuite';

export default class TextField extends PureComponent {
    render() {
      const { name, label, accepter, ...props } = this.props;
      return (
        <FormGroup>
          <ControlLabel>{label} </ControlLabel>
          <FormControl name={name} accepter={accepter} {...props} />
        </FormGroup>
      );
    }
}