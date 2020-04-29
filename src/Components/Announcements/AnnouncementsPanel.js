import React, { Component } from 'react';
import { Avatar, Badge, Icon, IconButton, Drawer, Tag } from 'rsuite';
import withCourse from '../Courses/Context/withCourse';

class AnnouncementsPanel extends Component{
    constructor(props){
        super(props);

        this.state = {
            drawerShow: false
        };

        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.renderAdmin = this.renderAdmin.bind(this);
    }

    toggleDrawer(){
        this.setState({drawerShow: !this.state.drawerShow});
    }

    renderAdmin(){
        const uid = this.props.authUser.uid;
        let userCourses = !!(this.props.authUser.coursesCreated)? true: false;
        
        //User created courses
        if(userCourses){
            userCourses = this.props.coursesList.filter(course => {
                return course.createdBy === uid && course.announcements;
            })
            let announcements = [];

            userCourses.forEach(course => {
                const announcementKey = Object.keys(course.announcements);

                announcementKey.forEach(aKey => {
                    const date = new Date(course.announcements[aKey].createdOn).toLocaleString();
                    announcements.push({
                        courseTitle: course.title,
                        content: course.announcements[aKey].content,
                        createdOn: date,
                        createdBy: course.announcements[aKey].createdBy,
                    })
                })
            })
            announcements = announcements.sort((a, b) => (a.createdOn < b.createdOn) ? 1 : ((b.createdOn < a.createdOn) ? -1 : 0)); 

            return(
                <div style={{flex: 1}}>
                    {announcements.length? 
                        announcements.map((a, i) => {
                            return(
                                <>
                                    <Tag color="violet">{a.courseTitle}</Tag>
                                    <Tag>{a.createdOn} - <span style={{fontWeight: 'bold'}}>{a.createdBy? a.createdBy: 'Unknown'}</span></Tag>
                                    <p>{a.content}</p>
                                    <br/>
                                </>
                            )
                        })
                    :   <p style={{textAlign: 'center', fontStyle: 'italic'}}>No announcements have been created...</p>    
                    }
                </div>

            )
        }
        else{
            return(
                <p style={{textAlign: 'center', fontStyle: 'italic'}}>Nothing to display...</p>
            )
        }

    }

    renderStudent(){
        let enrolledCourses = this.props.authUser.enrolledCourses;
        let announcements = [];

        if(enrolledCourses){
            enrolledCourses = Object.keys(enrolledCourses).map(key => {
                return enrolledCourses[key].courseId;
            })

           enrolledCourses = this.props.coursesList.filter(course => {
               return enrolledCourses.includes(course.uid.substr(1));
           })

           enrolledCourses.forEach(course => {
                if(course.announcements){
                    Object.keys(course.announcements).forEach(aKey => {
                        const date = new Date(course.announcements[aKey].createdOn).toLocaleString();
                        announcements.push({
                            courseTitle: course.title,
                            content: course.announcements[aKey].content,
                            createdOn: date,
                            createdBy: course.announcements[aKey].createdBy,
                        })
                    })
                }
           })
           
            announcements = announcements.sort((a, b) => (a.createdOn < b.createdOn) ? 1 : ((b.createdOn < a.createdOn) ? -1 : 0));
            return(
                <div style={{flex: 1}}>
                    {announcements.length? 
                        announcements.map((a, i) => {
                            return(
                                <div key={i} id="announcementItem">
                                    <Tag color="violet">{a.courseTitle}</Tag>
                                    <Tag>{a.createdOn} - <span style={{fontWeight: 'bold'}}>{a.createdBy? a.createdBy: 'Unknown'}</span></Tag>
                                    <p>{a.content}</p>
                                    <br/>
                                </div>
                            )
                        })
                    :   <p style={{textAlign: 'center'}}>No announcements have been created...</p>    
                    }
                </div>
    
            )
        }        
    }

    render(){
        return(
            <div>
                <Badge content={null} >
                    <Avatar size="sm">
                    <IconButton  
                    id='announcements'
                        icon={<Icon icon="bell" />}
                        onClick= {this.toggleDrawer}
                    />
                    </Avatar>
                </Badge>

                <Drawer size='md' show={this.state.drawerShow} onHide={this.toggleDrawer} >
                    <Drawer.Header>
                        <Drawer.Title>Announcements</Drawer.Title>
                        <Drawer.Body style={{height: '100%'}}>
                            {
                                this.props.authUser.roles.userRole === 'admin'?
                                    this.renderAdmin()
                                :   this.renderStudent()
                            
                            }
                        </Drawer.Body>
                    </Drawer.Header>
                </Drawer>
            </div>
        )
    }
}

export default withCourse(AnnouncementsPanel);