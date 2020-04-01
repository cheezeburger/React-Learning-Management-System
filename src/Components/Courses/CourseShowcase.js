import React, { Component } from 'react';
import { Panel } from 'rsuite';
import { NavLink } from 'react-router-dom';

export default class CourseShowcase extends Component{

    render(){
        const course = this.props.course;
        return(
            <div style={{marginRight: '6px'}}>
                <NavLink to={`/courses/${course.uid.substr(1)}`} style={{ textDecoration: 'none' }}>
                    <Panel shaded bordered bodyFill style={{ display: 'inline-block', width: 240 }}>
                        <img 
                            alt= ''
                            src= {course.image}
                            style= {{height:"150px", width: '100%'}}
                        />
                        <Panel style={{maxHeight: '150px', minHeight: '180px'}}>
                            <div style={{color: '#272c36', minHeight: '80px', maxHeight: '80px', fontSize: '16px', lineHeight: 1.25}}>
                                <p>{course.title}</p>
                            </div>
                            <p style={{maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'black'}}>
                                {course.description}
                            </p>
                        </Panel>
                    </Panel>
                </NavLink>
            </div>
        )
    }
}