import React from 'react';
import { withFirebase } from '../../Firebase';
import { Loader } from 'rsuite';

const withCourse = Component => {
    class WithCourse extends React.Component{
        constructor(props){
            super(props);

            this.state = {
                coursesList: null,
                course: null,
                loading: true,
            }

            this.getCourse = this.getCourse.bind(this);
        }

        componentDidMount(){
            this.listener = this.props.firebase.onAuthCourseListener((coursesList)=>{
                this.setState({ coursesList, loading: false })
            },
            ()=>{
                this.setState({ coursesList: null, loading: false })
                }
            )
        }
        
        async getCourse(id){
            const {coursesList} = this.state;
            let foundCourse = null;
            
            await new Promise(rs => {
                for(let i = 0; i< coursesList.length; i++){
                    if(coursesList.uid === id){
                        foundCourse = coursesList[i];
                        rs();
                        break;
                    }
                }
            })
            return foundCourse;
        }

        render(){
            return(
                <>
                    {
                        this.state.loading?
                            <Loader center/>
                        :   
                        (
                            this.state.coursesList?
                                <Component {...this.props} coursesList={this.state.coursesList} getCourse={this.getCourse}/>
                            :   <Component {...this.props} />
                        )
                    }
                </>
            )
        }
    }

    return withFirebase(WithCourse);
}

export default withCourse;