import React, { Component } from 'react';
import { Container, Progress, Button } from 'rsuite';
const { Line } = Progress;

export default class CourseBar extends Component{
    render(){
        return(
            <div 
                style={{border: '1px solid #F5F5F5', borderRadius: '5px', marginBottom: '5px', width:'500px'}}
            >
                <Button>
                    <Container style ={{flex: 1, flexDirection: 'row'}}>
                        <Container style= {{flex: 1}}>
                            <img 
                                src = "https://mfranc.com/images/code_review.jpeg"
                                style= {{width: '100%', height: '100%'}}
                                alt = ''
                            />
                        </Container>
                        <Container style ={{flex: 3, flexDirection: 'column'}}>
                            <div style= {{padding: '10px', fontSize: '12px'}}>
                                <p>Programming and Problem Solving</p>
                                <p>Bachelor of Science, Degree</p>
                            </div>
                            <Line percent={this.props.percent} status='active'/>
                        </Container>
                    </Container>
                </Button>
            </div>
        )
    }
}