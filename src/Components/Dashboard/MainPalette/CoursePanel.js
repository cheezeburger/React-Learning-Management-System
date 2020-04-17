import React from 'react';
import AdminCoursePalette from './AdminCoursePalette';
import StudentCoursePalette from './StudentCoursePalette';

class CoursePanel extends React.Component{
    render(){
        const authUser = this.props.authUser;
        return(
            authUser.roles.userRole === 'admin'?
                <AdminCoursePalette authUser={authUser}/>
            : <StudentCoursePalette authUser={authUser}/> 
        )
    }
}

export default CoursePanel;