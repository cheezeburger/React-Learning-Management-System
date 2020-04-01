import React, {Component} from 'react';
import {Icon, Navbar, Nav} from 'rsuite';
import {NavLink} from 'react-router-dom';
import AuthUserContext from '../Session/context';
import { withFirebase } from '../Firebase';

class TopNavBar extends Component {
    render(){
        return(
            <AuthUserContext.Consumer>
                {
                    authUser => {
                        return(
                            <div>
                                <Navbar appearance="inverse">
                                    <Navbar.Header style={{display: "flex", padding: '18px 20px', alignItems: 'center', justifyContent: 'center'}}>
                                        <div>
                                            <Icon icon="book" size="2x" style={{paddingRight: '5px'}}/>
                                            <NavLink to="/" style={{fontSize: '25px', textDecoration: 'none'}}>Webcademy</NavLink>
                                        </div>
                                    </Navbar.Header>

                                    <Nav pullRight>
                                        {
                                            authUser? 
                                                (<>
                                                    <Nav.Item>  
                                                        <NavLink to="/dashboard" style={{color:'white', textDecoration: 'none'}}>Dashboard</NavLink>
                                                    </Nav.Item>
                                                    <Nav.Item onSelect={this.props.firebase.doSignOut}>
                                                        Sign out
                                                    </Nav.Item>
                                                </>
                                                )
                                                :
                                                (<>
                                                    <Nav.Item>  
                                                        <NavLink to="/signup" style={{color:'white', textDecoration: 'none'}}>Signup</NavLink>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <NavLink to="/login" style={{color:'white', textDecoration: 'none'}}>Login</NavLink>
                                                    </Nav.Item>
                                                </>)
                                        }
                                    </Nav>
                                </Navbar>
                            </div>
                        )
                    }
                }
            </AuthUserContext.Consumer>
        )
    }
}

export default withFirebase(TopNavBar);