import React from 'react';
import { withFirebase } from '../Firebase';
import {Nav, Icon} from 'rsuite';

const SignOutButton = ({ firebase }) => (
    <Nav.Item onSelect={firebase.doSignOut} icon={<Icon icon="sign-out"/>}>
        <p style={{fontSize: '12px'}}>Sign out</p>
    </Nav.Item>
);

export default withFirebase(SignOutButton);