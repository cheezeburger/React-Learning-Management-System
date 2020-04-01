import React from 'react';
import {compose} from 'recompose';
import mainTemplate from '../../Templates/MainTemplate'
import {withFirebase} from '../../Firebase';
import {withAuthorization} from '../../Session'
import {NavLink} from 'react-router-dom';
import AnnouncementsPanel from '../../Announcements/AnnouncementsPanel';
import { Breadcrumb } from 'rsuite';
import Body from './Body';

const Header = (props) => (
    <div>
        <div style ={{position: 'absolute', right: 18, top: 10}}>
            <AnnouncementsPanel {...props}/>
        </div>
    </div>
)

const BreadCrumb = () => (
    <Breadcrumb style={{fontSize: '12px'}}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <Breadcrumb.Item active>Add New Course</Breadcrumb.Item>
    </Breadcrumb>
)

const condition = authUser => authUser && !!(authUser.roles['userRole'] === 'admin');

let AddCoursePage = mainTemplate(Header, BreadCrumb, Body);

export default compose(
    withAuthorization(condition),
    withFirebase,
)(AddCoursePage);

