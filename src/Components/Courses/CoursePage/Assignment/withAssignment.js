import React from 'react';
import { withFirebase } from '../../../Firebase';
import { Alert } from 'rsuite';

const withAssignment = Component => {
    class WithAssignment extends React.Component{
        updateAssignment = (courseId, assignmentId, questions) => {
            questions = questions? questions: [];
            this.props.firebase.assignments(courseId).child(assignmentId).update({questions}).then(()=>{
                Alert.success('Successfully saved');
            }).catch(err => {Alert.error('Save failed... Please try again.')})
        }

        render(){
            return(
                <Component {...this.props} 
                    getAssignments={this.getAssignments} 
                    updateAssignment={this.updateAssignment}
                />
            )
        }
    }

    return withFirebase(WithAssignment);
}

export default withAssignment;