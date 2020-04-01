import React from 'react';
import { Container } from 'rsuite';
import CourseShowcase from '../CourseShowcase';

export default class Body extends React.Component{

    render(){
        const coursesList = this.props.coursesList;

        return(
            <Container style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginLeft: '20px'}}>
            {
                coursesList && coursesList.length?
                    Array.from(coursesList).reverse().map(course => {
                        return (
                            <CourseShowcase course={course}/>
                        )
                    })	
                : <p>No courses found...</p>
            }
        </Container>
        )
    }
}