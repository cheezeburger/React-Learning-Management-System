import React from 'react';
import { withAuthorization } from '../Session';

import AnnouncementsPanel from '../Announcements/AnnouncementsPanel';
import mainTemplate from '../Templates/MainTemplate';
import { Breadcrumb } from 'rsuite';
import CoursePanel from './MainPalette/CoursePanel';

const Header = (props) => (
    <div>
        <div style ={{position: 'absolute', right: 18, top: 10}}>
            <AnnouncementsPanel {...props}/>
        </div>
    </div>
)

const BreadCrumb = () => (
    <Breadcrumb style={{fontSize: '12px'}}>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
    </Breadcrumb>
)

const Body = (props) => (
    <div>
        <div>
            <CoursePanel {...props}/>
        </div>
    </div>
)

const condition = authUser => !!authUser;

const WrappedComponents = mainTemplate(Header, BreadCrumb, Body);

export default withAuthorization(condition)(WrappedComponents);