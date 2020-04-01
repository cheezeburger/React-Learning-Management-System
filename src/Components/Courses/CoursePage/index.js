import React from 'react';
import AnnouncementsPanel from '../../Announcements/AnnouncementsPanel';
import mainTemplate from '../../Templates/MainTemplate';
import { Breadcrumb } from 'rsuite';
import Body from './Body';
import withCourse from '../Context/withCourse';
import { NavLink } from 'react-router-dom';

const Header = (props) => (
    <div>
        <div style ={{position: 'absolute', right: 18, top: 10}}>
            <AnnouncementsPanel {...props}/>
        </div>
    </div>
)

const BreadCrumb = (props) => (
    <Breadcrumb style={{fontSize: '12px'}}>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <Breadcrumb.Item active>Courses</Breadcrumb.Item>
    </Breadcrumb>
)

const body = (props) => {
    return(
        <div>
            <div>
                <Body {...props}/>
            </div>
        </div>
    )
}



const WrappedComponents = mainTemplate(Header, BreadCrumb, body);

export default withCourse(WrappedComponents);
