import React from 'react';
import { withFirebase } from '../../../Firebase';
import { Alert } from 'rsuite';

const withCurriculum = Component => {
    class WithCurriculum extends React.Component{
        constructor(props){
            super(props);

            this.state = {
                content: null,
            }
            this.getCurriculum = this.getCurriculum.bind(this);
            this.updateCurriculum = this.updateCurriculum.bind(this);

        }

        componentDidMount(){
            
        }

        getCurriculum(courseId, curriId){
            this.props.firebase.courseCurriculums(courseId).child(curriId).child('curriculumContent').once('value').then(snapshot => {
                this.setState({content: snapshot.val()});
            })
        }

        updateCurriculum(courseId, curriId, content){
            this.props.firebase.courseCurriculums(courseId).child(curriId).update({curriculumContent: content}).then(()=>{
                Alert.success('Successfully saved');
            }).catch(err => {Alert.error('Save failed... Please try again.')})
        }

        render(){
            return(
                <Component {...this.props} 
                    getCurriculum={this.getCurriculum} 
                    content={this.state.content}
                    updateCurriculum={this.updateCurriculum}
                />
            )
        }
    }

    return withFirebase(WithCurriculum);
}

export default withCurriculum;