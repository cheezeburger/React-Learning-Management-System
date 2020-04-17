import 'rsuite/dist/styles/rsuite-default.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Login from './Components/Login/';
import HomePage from './Components/LandingPage/HomePage.js';
import SignUp from './Components/Signup';
import Dashboard from './Components/Dashboard';

import { withAuthentication } from './Components/Session';
import AddCourses from './Components/Courses/AddCourses';
import EditCourses from './Components/Courses/EditCourses';
import CoursePage from './Components/Courses/CoursePage';
import CurriculumPage from './Components/Courses/CoursePage/Curriculum/CurriculumPage';
import Announcement from './Components/Announcements/AddAnnouncement';
import AllCourses from './Components/Courses/AllCourses';
import AssignmentPage from './Components/Courses/CoursePage/Assignment/AssignmentPage';
import AdminSubmission from './Components/Courses/CoursePage/Assignment/AdminSubmission';

const App = () => (
    <Router>
        <div>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/dashboard' component={Dashboard} />
            <Route exact path='/courses' component={AllCourses} />
            <Route exact path='/course/add' component={AddCourses} />
            <Route exact path='/announcement/add' component={Announcement} />
            <Route exact path='/course/edit/:id' component={EditCourses} />
            <Route exact path='/courses/:id' component={CoursePage} />
            <Route exact path='/submissions' component={AdminSubmission} />
            <Route
                exact
                path='/courses/:id/curriculum/:id'
                component={CurriculumPage}
            />
            <Route
                exact
                path='/courses/:id/assignment/:id'
                component={AssignmentPage}
            />
        </div>
    </Router>
);

export default withAuthentication(App);
