import React from 'react';
import AdminCoursePalette from './AdminCoursePalette';

class CoursePanel extends React.Component{
    render(){
        console.log(this.props)
        const authUser = this.props.authUser;
        return(
            authUser.roles.userRole === 'admin'?
                <AdminCoursePalette authUser={authUser}/>
            : ''      
        )
    }
}

export default CoursePanel;