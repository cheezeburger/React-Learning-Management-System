import React from 'react';
import { withFirebase } from '../../Firebase';
import { FlexboxGrid, List, Button } from 'rsuite';
import { NavLink, Link } from 'react-router-dom';

class AdminCoursePalette extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            courses: [],
        }
    }
    async componentDidMount(){
        const createdCourses = this.props.authUser.coursesCreated;
        let coursesList = [];
        let courses = null;

        if(createdCourses){
            coursesList = Object.keys(createdCourses).map(key => 
                createdCourses[key].courseId
            );
    
            coursesList = coursesList.map(id => {
                return new Promise(rs => {
                    this.props.firebase.course(`-${id}`)
                        .once('value')
                        .then(snapshot => {    
                            const course = snapshot.val();
                            rs({course, id});
                        })
                })
            })

            courses = await Promise.all(coursesList).then(courses =>{
                return courses;
            })
            
            this.setState({courses});
        }
        
        
    }

    render(){
        const courses = this.state.courses ? this.state.courses: [];
        return(
            <div>
                <div style={{marginBottom: '5px'}}>
                    <p>My Created Courses</p>
                </div>
                <div>
                    {
						courses? 
							<List hover>
							{
								courses.map((course, i)=> {
									let curriculum = course.course.curriculum || {};
									curriculum = curriculum? Object.keys(curriculum).length: 0;
                                    let students = course.course.students? Object.keys(course.course.students).length : 0;
									return(
										<>
											<NavLink to={`/courses/${course.id}`} style={{textDecoration:'none', color: '#575757'}}>
												<List.Item key={i} index={i}>
													<FlexboxGrid>
														<FlexboxGrid.Item colspan={3}>
															<img src={course.course.image} width='100px' height='70px' alt=''></img>
														</FlexboxGrid.Item>

														<FlexboxGrid.Item colspan={8} style={{
															...styleCenter,
															flexDirection: 'column',
															alignItems: 'flex-start',
															overflow: 'hidden'
														}}>
															<div style={titleStyle}>
																{course.course.title}
															</div>
														</FlexboxGrid.Item >

														<FlexboxGrid.Item colspan={3}>
															<div style={{ textAlign: 'right' }}>
																<div style={slimText}>Students</div>
                                                                <div style={dataStyle}>{students}</div>
															</div>
														</FlexboxGrid.Item>

														<FlexboxGrid.Item colspan={3}>
															<div style={{ textAlign: 'right' }}>
																<div style={slimText}>Curriculums</div>
															    <div style={dataStyle}>{curriculum}</div>
															</div>
														</FlexboxGrid.Item>

														<FlexboxGrid.Item colspan={4} style={{
															...styleCenter
														}}>
                                                            <Link to={{
                                                                pathname: `/course/edit/${course.id}`,
                                                                state: {
                                                                    course: course.course
                                                                }
                                                            }}>
                                                                <Button color="yellow" appearance="ghost">
                                                                    Edit
                                                                </Button>
                                                            </Link>
														</FlexboxGrid.Item>
													</FlexboxGrid>
												</List.Item>
											</NavLink>
										</>
									)
								})
							}
						</List>
						: <p>No courses created...</p>
                    }
                </div>
            </div>
        )
    }
}

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
};
  
  const slimText = {
    fontSize: '0.666em',
    color: '#97969B',
    fontWeight: 'lighter',
    paddingBottom: 5
};
  
  const titleStyle = {
    padding: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500,
    fontSize: '14px'
};
  
  const dataStyle = {
    fontSize: '1.2em',
    fontWeight: 500
};
export default withFirebase(AdminCoursePalette);