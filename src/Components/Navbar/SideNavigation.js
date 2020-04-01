import React, { Component } from 'react';
import { Sidenav, Icon, Nav, Avatar } from 'rsuite';
import SignOutButton from '../Signout/SignOutButton';
import { NavLink } from 'react-router-dom';

export default class SideNavigation extends Component {
   constructor() {
      super();
      this.state = {
         expanded: true
      };
   }

   render() {
      const { expanded }    = this.state;
      let role              = this.props.roles.userRole;
      role                  = role[0].toUpperCase() + role.substr(1);

      return (
         <div style={{ width: 200 }}>
            <Sidenav
               expanded={expanded}
               appearance='subtle'
               style={{
                  backgroundColor: '#1a1d24',
                  position: 'fixed',
                  width: '200px',
                  top: 0,
                  left: 0,
                  zIndex: 10,
                  height: '100vh'
               }}>
               <Sidenav.Header>
                  <div
                     style={{
                        backgroundColor: '#1a1d24',
                        padding: '20px 20px 10px',
                        fontSize: '16px',
                        color: 'white'
                     }}>
                     <NavLink
                        to='/'
                        style={{
                           textDecoration: 'none',
                           color: 'white'
                        }}>
                        <Icon icon='book' style={{ marginRight: '5px' }} />
                        Webcademy
                     </NavLink>
                  </div>
               </Sidenav.Header>

               <Sidenav.Body>
                  <Nav
                     style={{
                        textAlign: 'center',
                        color: 'white',
                        marginTop: '20px',
                        marginBottom: '20px'
                     }}>
                     <Avatar size='lg'>
                        <Icon icon='user-o' />
                     </Avatar>
                  </Nav>
                  <p
                     style={{
                        color: 'white',
                        textAlign: 'center',
                        marginTop: '-10px',
                        fontSize: '11px'
                     }}>
                     {role}
                  </p>

                  <Nav>
                     <NavLink to='/dashboard' style={NavLinkStyle}>
                        <Nav.Item icon={<Icon icon='dashboard' />}>
                           <p style={{ fontSize: '12px' }}>Dashboard</p>
                        </Nav.Item>
                     </NavLink>

                     <NavLink to='/courses' style={NavLinkStyle}>
                        <Nav.Item icon={<Icon icon='heart' />}>
                           <p style={{ fontSize: '12px' }}>All Courses</p>
                        </Nav.Item>
                     </NavLink>

                     <NavLink to='/dashboard' style={NavLinkStyle}>
                        <Nav.Item icon={<Icon icon='pencil' />}>
                           <p style={{ fontSize: '12px' }}>Assignments</p>
                        </Nav.Item>
                     </NavLink>
                  </Nav>

                  {role === 'Admin' ? (
                     <Nav style={{ marginTop: '60px' }}>
                        <NavLink
                           to='/course/add'
                           style={{
                              ...NavLinkStyle
                           }}>
                           <Nav.Item icon={<Icon icon='plus-square' />}>
                              <p style={{ fontSize: '12px' }}>Create course</p>
                           </Nav.Item>
                        </NavLink>

                        <NavLink
                           to='/announcement/add'
                           style={{
                              ...NavLinkStyle
                           }}>
                           <Nav.Item icon={<Icon icon='plus-square' />}>
                              <p style={{ fontSize: '12px' }}>
                                 Create Announcement
                              </p>
                           </Nav.Item>
                        </NavLink>

                        <NavLink
                           to='/announcement/add'
                           style={{
                              ...NavLinkStyle,
                              color: '#8e8e93'
                           }}>
                           <Nav.Item icon={<Icon icon='plus-square' />}>
                              <p style={{ fontSize: '12px' }}>
                                 Create Assignment
                              </p>
                           </Nav.Item>
                        </NavLink>
                     </Nav>
                  ) : null}

                  <Nav
                     style={{
                        bottom: 0,
                        position: 'absolute',
                        width: '100%'
                     }}>
                     <SignOutButton />
                  </Nav>
               </Sidenav.Body>
            </Sidenav>
         </div>
      );
   }
}

const NavLinkStyle = {
   textDecoration: 'none',
   color: '#8e8e93'
};
